/**
 * MouseRepulsion.js — Flow Field Engine
 *
 * Implements two distinct physics primitives:
 *
 * 1.  curlNoise2D  — divergence-free (incompressible) 2D flow field derived
 *     from the numerical curl of a noise potential. Creates natural vortices,
 *     eddies and swirling patterns with NO sources or sinks.
 *
 * 2.  cursorDisturbance — Rankine cylinder potential flow.
 *     When the cursor moves, it acts like a cylinder moving through an ideal
 *     fluid: particles split and flow smoothly AROUND the cursor rather than
 *     simply flying outward. This is the same mathematics used to describe
 *     water flowing around a ship's hull.
 *
 *     At rest the cursor provides only a soft radial displacement so particles
 *     don't pile up on the cursor position. As cursor speed increases, the
 *     potential flow pattern dominates — asymmetric, organic, cinematic.
 */

// ─── Quintic-smoothstep hash noise ────────────────────────────────────────────

function hash(n) {
  return (((Math.sin(n) * 43758.5453123) % 1) + 1) % 1;
}

/**
 * Value noise in [-1, 1] using quintic smoothstep (C² continuous).
 */
export function noise2D(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const ux = fx * fx * fx * (fx * (fx * 6 - 15) + 10);
  const uy = fy * fy * fy * (fy * (fy * 6 - 15) + 10);

  const a = hash(ix       + iy * 57);
  const b = hash(ix + 1   + iy * 57);
  const c = hash(ix       + (iy + 1) * 57);
  const d = hash(ix + 1   + (iy + 1) * 57);

  const v = a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
  return v * 2 - 1; // remap [0,1] → [-1,1]
}

/**
 * 2D curl noise — divergence-free flow field.
 *
 * Given a scalar potential field N(x, y, t), the curl in 2D is:
 *   curl_x =  ∂N/∂y
 *   curl_y = -∂N/∂x
 *
 * This gives a vector field with zero divergence — incompressible, like water.
 * Naturally produces vortices and spirals without needing special rules.
 *
 * @param {number} x  world x (scaled down before passing in)
 * @param {number} y  world y (scaled down before passing in)
 * @param {number} t  time (for evolution)
 * @returns {{ x: number, y: number }} flow velocity in [-1, 1]
 */
export function curlNoise2D(x, y, t) {
  const eps  = 0.07;         // finite difference step
  const t1   = t * 0.10;     // slow time drift on y-axis
  const t2   = t * 0.075;    // slightly different speed on x-axis (breaks symmetry)

  const dndy = (noise2D(x + t1,       y + eps) - noise2D(x + t1,       y - eps)) / (2 * eps);
  const dndx = (noise2D(x + eps, y + t2      ) - noise2D(x - eps, y + t2      )) / (2 * eps);

  return { x: dndy, y: -dndx };
}

/**
 * Cursor disturbance — Rankine cylinder potential flow + soft static push.
 *
 * HOW IT WORKS:
 *   Treat the cursor as a solid cylinder of radius `innerR` moving through an
 *   ideal incompressible fluid. Using the complex velocity potential:
 *
 *     w(z) = U · (z + R²/z)
 *
 *   where z = lx + i·ly (position in cursor-aligned frame), we get a velocity
 *   field where streamlines wrap smoothly around the cylinder.
 *
 *   The "disturbance" returned is  v_actual − v_background  so that at large
 *   distances the contribution vanishes cleanly.
 *
 *   At low cursor speed the Rankine contribution is small; a soft radial push
 *   is blended in so particles are always gently displaced from the cursor.
 *
 * @param {number} dx       particle.x − cursor.x
 * @param {number} dy       particle.y − cursor.y
 * @param {number} dist     precomputed sqrt(dx²+dy²)
 * @param {number} cdx      normalized cursor velocity x (0 if stationary)
 * @param {number} cdy      normalized cursor velocity y
 * @param {number} speed    cursor speed, world units/frame
 * @param {number} innerR   "cylinder" radius — inner exclusion zone
 * @param {number} outerR   outer influence radius
 * @param {number} pushStr  static push amplitude
 * @param {number} flowStr  Rankine flow amplitude multiplier
 * @returns {{ vx: number, vy: number }} velocity contribution for this particle
 */
export function cursorDisturbance(
  dx, dy, dist,
  cdx, cdy, speed,
  innerR, outerR,
  pushStr, flowStr
) {
  if (dist >= outerR || dist < 1e-7) return { vx: 0, vy: 0 };

  // Smooth outer envelope: C¹, value = 1 at dist=0, 0 at dist=outerR
  const t    = dist / outerR;
  const env  = (1 - t) * (1 - t) * (1 + 2 * t); // cubic hermite

  // ── Static radial push ──────────────────────────────────────────────────
  const invD = 1 / dist;
  const rx   = dx * invD;
  const ry   = dy * invD;

  // Hard inner zone: particles bounce out of the cursor's "body"
  const innerT    = Math.max(0, 1 - dist / innerR);
  const hardPush  = innerT * innerT * pushStr * 4;
  const softPush  = env * pushStr;

  const staticX = rx * (hardPush + softPush);
  const staticY = ry * (hardPush + softPush);

  // ── Rankine cylinder potential flow ─────────────────────────────────────
  let flowX = 0, flowY = 0;

  const MOVING_THRESHOLD = 0.002;  // world units/frame

  if (speed > MOVING_THRESHOLD) {
    // Transform particle offset into cursor-aligned local frame
    //   lx → along cursor direction     (− = ahead of cursor)
    //   ly → perpendicular to cursor
    const lx = dx *  cdx + dy * cdy;
    const ly = dx * (-cdy) + dy * cdx;

    const rSq   = lx * lx + ly * ly;
    const RSq   = innerR * innerR;
    const denom = rSq * rSq;

    if (denom > 1e-12) {
      // Rankine velocity in local frame
      //   Re(1 − R²/z²):  z² = (lx²−ly²) + 2i·lx·ly
      //   so R²/z² = R²·[(lx²−ly²) − 2i·lx·ly] / (lx²+ly²)²
      const U       = flowStr * Math.min(speed * 10, 2.8);
      const realZ2  = lx * lx - ly * ly;
      const imagZ2  = 2 * lx * ly;

      const vLocalX = U * (1 -  RSq * realZ2 / denom);
      const vLocalY = U * (-RSq * imagZ2 / denom);

      // Rotate back to world frame
      //   world = local_x * cursorDir + local_y * cursorPerp
      const vWorldX = vLocalX * cdx - vLocalY * cdy;
      const vWorldY = vLocalX * cdy + vLocalY * cdx;

      // Remove background flow (U × cursor_direction) to get only the disturbance
      flowX = (vWorldX - U * cdx) * env;
      flowY = (vWorldY - U * cdy) * env;
    }
  }

  // ── Blend: stationary → push, fast → mostly Rankine flow ───────────────
  const blend = Math.min(speed / (MOVING_THRESHOLD * 6), 1.0);

  return {
    vx: staticX * (1 - blend * 0.55) + flowX * blend,
    vy: staticY * (1 - blend * 0.55) + flowY * blend,
  };
}
