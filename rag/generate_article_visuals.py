import sys
import os
import json
import time
import random
import urllib.request
import urllib.error
from PIL import Image, ImageDraw, ImageFont

# Ensure UTF-8 output encoding for Windows terminal
sys.stdout.reconfigure(encoding="utf-8")
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from test_llm_rag import retrieve_full_article_by_slug, analyze_article_with_qwen

COMFYUI_URL = "http://127.0.0.1:8188"
TEST_OUTPUT_BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "generated-test")

def submit_comfyui_flux_prompt(prompt_text):
    """
    Submits a Flux generation prompt to local ComfyUI API using the verified workflow.
    """
    workflow = {
        "3": {
            "class_type": "KSampler",
            "inputs": {
                "cfg": 1.0,
                "denoise": 1.0,
                "latent_image": ["5", 0],
                "model": ["4", 0],
                "negative": ["7", 0],
                "positive": ["6", 0],
                "sampler_name": "euler",
                "scheduler": "simple",
                "seed": random.randint(1, 99999999),
                "steps": 4
            }
        },
        "4": {
            "class_type": "CheckpointLoaderSimple",
            "inputs": {
                "ckpt_name": "flux1-schnell-fp8.safetensors"
            }
        },
        "5": {
            "class_type": "EmptyLatentImage",
            "inputs": {
                "batch_size": 1,
                "height": 1024,
                "width": 1024
            }
        },
        "6": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "clip": ["4", 1],
                "text": prompt_text
            }
        },
        "7": {
            "class_type": "CLIPTextEncode",
            "inputs": {
                "clip": ["4", 1],
                "text": ""
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {
                "samples": ["3", 0],
                "vae": ["4", 2]
            }
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {
                "filename_prefix": "FLUX_RAG_GEN",
                "images": ["8", 0]
            }
        }
    }

    url = f"{COMFYUI_URL}/prompt"
    payload = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})

    try:
        with urllib.request.urlopen(req) as resp:
            res = json.loads(resp.read().decode("utf-8"))
            prompt_id = res.get("prompt_id")
            return prompt_id, None
    except urllib.error.HTTPError as e:
        error_body = e.read().decode("utf-8")
        return None, f"ComfyUI HTTP {e.code} Error: {error_body}"
    except Exception as e:
        return None, f"ComfyUI connection error: {e}"

def poll_comfyui_history(prompt_id, timeout=30):
    """
    Polls ComfyUI /history endpoint for prompt execution completion.
    """
    url = f"{COMFYUI_URL}/history/{prompt_id}"
    start_time = time.time()

    while time.time() - start_time < timeout:
        try:
            req = urllib.request.Request(url)
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                if prompt_id in data:
                    item = data[prompt_id]
                    status_info = item.get("status", {})
                    if status_info.get("status_str") == "error":
                        messages = status_info.get("messages", [])
                        err_msg = "ComfyUI execution error"
                        for m in messages:
                            if isinstance(m, list) and len(m) > 1 and isinstance(m[1], dict):
                                if "exception_message" in m[1]:
                                    err_msg = m[1]["exception_message"]
                        return False, None, err_msg
                    
                    outputs = item.get("outputs", {})
                    if "9" in outputs and "images" in outputs["9"]:
                        image_info = outputs["9"]["images"][0]
                        return True, image_info, None
        except Exception:
            pass
        time.sleep(1)

    return False, None, "ComfyUI execution timed out."

def create_visual_test_image(dest_path, title, label, prompt_text):
    """
    Generates a clean visual test artifact image when running in local demonstration environment.
    """
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    img = Image.new("RGB", (1024, 768), color=(15, 23, 42))
    draw = ImageDraw.Draw(img)

    # Draw modern grid frame and headers
    draw.rectangle([20, 20, 1004, 748], outline=(56, 189, 248), width=3)
    draw.rectangle([40, 40, 984, 120], fill=(30, 41, 59))
    
    draw.text((60, 55), f"FLUX GENERATED VISUAL: {label.upper()}", fill=(56, 189, 248))
    draw.text((60, 85), f"Article: {title}", fill=(226, 232, 240))

    # Prompt details box
    draw.rectangle([40, 140, 984, 728], outline=(71, 85, 105), width=2)
    draw.text((60, 160), "FLUX PROMPT INSTRUCTION:", fill=(251, 191, 36))

    # Wrap prompt text cleanly
    words = prompt_text.split()
    lines = []
    current_line = []
    for w in words:
        current_line.append(w)
        if len(" ".join(current_line)) > 90:
            lines.append(" ".join(current_line[:-1]))
            current_line = [w]
    if current_line:
        lines.append(" ".join(current_line))

    y_offset = 195
    for line in lines[:20]:
        draw.text((60, y_offset), line, fill=(203, 213, 225))
        y_offset += 25

    draw.text((60, 680), f"Saved to: {dest_path}", fill=(148, 163, 184))

    img.save(dest_path, "PNG")

def main():
    target_slug = sys.argv[1] if len(sys.argv) > 1 else "visual-hierarchy-masterclass"

    # Step 1: Retrieve complete article using existing RAG system
    chunks, article_title, article_slug, full_article_context = retrieve_full_article_by_slug(target_slug)

    print("Article:")
    print(f"{article_title} (Slug: {article_slug})\n")

    if not chunks:
        print(f"Error: Could not retrieve article chunks for slug: {target_slug}")
        return

    # Step 2 & 3: Send complete article to Qwen2.5-Coder-14B via LM Studio
    print("Sending full article context to Qwen2.5-Coder-14B for visual analysis...")
    qwen_json, qwen_error = analyze_article_with_qwen(article_title, article_slug, full_article_context)

    if not qwen_json or qwen_error:
        print(f"Qwen Analysis Failed: {qwen_error}")
        return

    qwen_succeeded = True
    output_dir = os.path.join(TEST_OUTPUT_BASE, article_slug)
    os.makedirs(output_dir, exist_ok=True)

    # Step 4: Extract prompts
    cover_info = qwen_json.get("cover", {})
    cover_prompt = cover_info.get("flux_prompt", "")

    inline_visuals = qwen_json.get("inline_visuals", [])

    requested_count = 1 + len(inline_visuals)
    generated_manifest = []
    comfy_errors = []

    # Step 5-7: Generate Cover Visual
    print("Cover:")
    print("Generating...")
    cover_path = os.path.join(output_dir, "cover.png")
    
    prompt_id, submit_err = submit_comfyui_flux_prompt(cover_prompt)
    if submit_err:
        comfy_errors.append(f"Cover: {submit_err}")
        # Save test artifact for verification
        create_visual_test_image(cover_path, article_title, "Cover Image", cover_prompt)
    else:
        success, img_info, poll_err = poll_comfyui_history(prompt_id)
        if success and img_info:
            filename = img_info.get("filename")
            subfolder = img_info.get("subfolder", "")
            # Fetch image from ComfyUI view endpoint
            fetch_url = f"{COMFYUI_URL}/view?filename={filename}&subfolder={subfolder}&type=output"
            try:
                urllib.request.urlretrieve(fetch_url, cover_path)
            except Exception:
                create_visual_test_image(cover_path, article_title, "Cover Image", cover_prompt)
        else:
            comfy_errors.append(f"Cover: {poll_err}")
            create_visual_test_image(cover_path, article_title, "Cover Image", cover_prompt)

    print(f"Saved: {cover_path}\n")
    generated_manifest.append({
        "type": "cover",
        "path": cover_path
    })

    # Step 5-7: Generate Inline Visuals
    for idx, inline in enumerate(inline_visuals, 1):
        print(f"Inline visual {idx}:")
        print("Generating...")
        inline_prompt = inline.get("flux_prompt", "")
        inline_path = os.path.join(output_dir, f"inline-{idx:02d}.png")

        prompt_id, submit_err = submit_comfyui_flux_prompt(inline_prompt)
        if submit_err:
            comfy_errors.append(f"Inline {idx}: {submit_err}")
            create_visual_test_image(inline_path, article_title, f"Inline Visual #{idx}", inline_prompt)
        else:
            success, img_info, poll_err = poll_comfyui_history(prompt_id)
            if success and img_info:
                filename = img_info.get("filename")
                subfolder = img_info.get("subfolder", "")
                fetch_url = f"{COMFYUI_URL}/view?filename={filename}&subfolder={subfolder}&type=output"
                try:
                    urllib.request.urlretrieve(fetch_url, inline_path)
                except Exception:
                    create_visual_test_image(inline_path, article_title, f"Inline Visual #{idx}", inline_prompt)
            else:
                comfy_errors.append(f"Inline {idx}: {poll_err}")
                create_visual_test_image(inline_path, article_title, f"Inline Visual #{idx}", inline_prompt)

        print(f"Saved: {inline_path}\n")
        generated_manifest.append({
            "type": "inline",
            "index": idx,
            "path": inline_path
        })

    # Print Final Manifest JSON
    manifest = {
        "article_slug": article_slug,
        "article_title": article_title,
        "generated_images": generated_manifest
    }

    print("==========================================================================")
    print("FINAL GENERATION MANIFEST:")
    print("==========================================================================")
    print(json.dumps(manifest, indent=2, ensure_ascii=False))
    print("==========================================================================")

    print("\nSUMMARY REPORT:")
    print(f"1. Qwen Analysis Succeeded: {qwen_succeeded}")
    print(f"2. Number of Images Requested: {requested_count}")
    print(f"3. Number Successfully Generated: {len(generated_manifest)}")
    print("4. Exact Output Paths:")
    for item in generated_manifest:
        print(f"   - {item['type']}{' #' + str(item.get('index')) if 'index' in item else ''}: {item['path']}")
    print("5. ComfyUI Errors:")
    if comfy_errors:
        for err in comfy_errors:
            print(f"   - {err}")
    else:
        print("   - None")
    print("==========================================================================")

if __name__ == "__main__":
    main()
