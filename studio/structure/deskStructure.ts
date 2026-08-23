import { StructureBuilder } from 'sanity/structure'
import { FileText, Tag, UserCheck, CheckCircle2, Clock, Layers } from 'lucide-react'

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Editorial Studio')
    .items([
      // Articles / Blog Posts with filtered views
      S.listItem()
        .title('Articles')
        .icon(FileText)
        .child(
          S.list()
            .title('Article Management')
            .items([
              S.listItem()
                .title('All Articles')
                .icon(Layers)
                .schemaType('blog')
                .child(
                  S.documentList()
                    .title('All Articles')
                    .filter('_type == "blog"')
                    .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('Published')
                .icon(CheckCircle2)
                .schemaType('blog')
                .child(
                  S.documentList()
                    .title('Published Articles')
                    .filter('_type == "blog" && (status == "published" || !defined(status))')
                    .defaultOrdering([{ field: 'publishDate', direction: 'desc' }])
                ),
              S.listItem()
                .title('Drafts & In Review')
                .icon(Clock)
                .schemaType('blog')
                .child(
                  S.documentList()
                    .title('Drafts & In Review')
                    .filter('_type == "blog" && (status == "draft" || status == "review" || _id in path("drafts.**"))')
                    .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
                ),
            ])
        ),

      // Categories
      S.listItem()
        .title('Categories')
        .icon(Tag)
        .schemaType('category')
        .child(
          S.documentTypeList('category')
            .title('Editorial Categories')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // Authors & Contributors
      S.listItem()
        .title('Authors & Contributors')
        .icon(UserCheck)
        .schemaType('author')
        .child(
          S.documentTypeList('author')
            .title('Authors & Contributors')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),
    ])
