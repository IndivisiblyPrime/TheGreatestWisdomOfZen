---
description: Create a new Sanity schema type
---

Create a new Sanity schema based on the user's description: $ARGUMENTS

Follow these steps:

1. **Load Sanity rules first** - Use `mcp__Sanity__list_sanity_rules` then `mcp__Sanity__get_sanity_rules` to load the `sanity-schema` rule before writing any schema code.

2. **Determine schema details** - Based on the user's description, determine:
   - Schema name (camelCase, e.g., `blogPost`)
   - Schema title (Title Case, e.g., `Blog Post`)
   - Schema type (`document` for standalone content, `object` for reusable nested types)
   - Required fields and their types

3. **Create the schema file** at `src/sanity/schemaTypes/{schemaName}.ts` following this pattern:
   ```typescript
   import { defineField, defineType } from 'sanity'

   export const schemaName = defineType({
     name: 'schemaName',
     title: 'Schema Title',
     type: 'document',
     fields: [
       defineField({
         name: 'fieldName',
         title: 'Field Title',
         type: 'string',
         validation: (Rule) => Rule.required(),
       }),
     ],
   })
   ```

4. **Update the index file** at `src/sanity/schemaTypes/index.ts`:
   - Add the import for the new schema
   - Add the schema to the `schemaTypes` array

5. **Common field types reference**:
   - `string` - Short text
   - `text` - Long text
   - `number` - Numbers
   - `boolean` - True/false
   - `date` / `datetime` - Dates
   - `slug` - URL-friendly slugs (use `options: { source: 'title' }`)
   - `image` - Images (add `options: { hotspot: true }` for cropping)
   - `array` of `block` - Rich text (Portable Text)
   - `reference` - Links to other documents
   - `array` - Lists of items

6. **After creating the schema**, remind the user to:
   - Restart the dev server if running
   - Visit `/studio` to see the new content type
   - Create sample content in Sanity Studio
