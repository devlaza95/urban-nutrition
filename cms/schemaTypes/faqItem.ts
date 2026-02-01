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
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: portableTextOf,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
