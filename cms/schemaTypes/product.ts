import {defineField, defineType} from 'sanity'

const portableTextOf = [
  {
    type: 'block',
    styles: [
      {title: 'Normal', value: 'normal'},
      {title: 'H1', value: 'h1'},
      {title: 'H2', value: 'h2'},
      {title: 'H3', value: 'h3'},
      {title: 'H4', value: 'h4'},
      {title: 'Quote', value: 'blockquote'},
    ],
    marks: {
      decorators: [
        {title: 'Strong', value: 'strong'},
        {title: 'Emphasis', value: 'em'},
        {title: 'Code', value: 'code'},
      ],
      annotations: [
        {
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            {
              name: 'href',
              type: 'url',
              title: 'URL',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'caption',
        type: 'string',
        title: 'Caption',
      }),
      defineField({
        name: 'alt',
        type: 'string',
        title: 'Alternative text',
      }),
    ],
  },
]

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Product Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: portableTextOf,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'productInformation',
      title: 'Product Information',
      type: 'array',
      of: portableTextOf,
      description:
        'Rich text block for product details (packaging, portion, macros, allergens, etc.)',
    }),
    defineField({
      name: 'allergiesInfo',
      title: 'Allergies Info',
      type: 'array',
      of: portableTextOf,
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
    },
    prepare({title, media, price}) {
      return {
        title,
        media,
        subtitle: typeof price === 'number' ? `$${price}` : undefined,
      }
    },
  },
})
