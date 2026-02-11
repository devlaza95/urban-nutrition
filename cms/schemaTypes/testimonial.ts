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
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Customer Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'age',
      title: 'Age',
      type: 'number',
      // Optional field; if provided, must be non-negative
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'occupation',
      title: 'Occupation',
      type: 'string',
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
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
      title: 'name',
      subtitle: 'rating',
      media: 'image',
    },
    prepare({title, subtitle}) {
      return {
        title,
        subtitle: subtitle ? `Rating: ${subtitle}/5` : undefined,
      }
    },
  },
})
