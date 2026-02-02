export const landingPageQuery = `*[_type == "landingPage"][0]{
  _id,
  hero{
    headline,
    subheading,
    heroImage
  },
  nutritionInfo,
  allergiesInfo,
  deliveryInfo,
  returnsInfo,
  footer{
    socialLinks[]{
      platform,
      url
    },
    contact{
      phone,
      email,
      location
    }
  }
}`;

export const testimonialsQuery = `*[_type == "testimonial"] | order(_createdAt desc){
  _id,
  name,
  age,
  rating,
  description,
  image
}`;

export const productsQuery = `*[_type == "product"] | order(_createdAt desc){
  _id,
  name,
  price,
  shortDescription,
  description,
  productInformation,
  allergiesInfo,
  rating,
  images
}`;

export const faqItemsQuery = `*[_type == "faqItem"] | order(_createdAt desc){
  _id,
  title,
  description
}`;

export const whoIsItForItemsQuery = `*[_type == "whoIsItForItem"] | order(order asc){
  _id,
  title,
  description,
  order
}`;
