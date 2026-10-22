export interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  image: string;
  tag?: string;
  amenities: string[];
  description: string;
}

export interface Camp {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  image: string;
  tag?: string;
  amenities: string[];
  description: string;
}

export interface Tour {
  id: string;
  title: string;
  price: number;
  unit: string;
  image: string;
  duration: string;
  rating: number;
  reviews: number;
  location: string;
  tag?: string;
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  distance: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  avatar: string;
  rating: number;
  review: string;
}

export const hotelsData: Hotel[] = [
  {
    id: "hotel-heritage-haveli",
    name: "Hotel Heritage Haveli",
    rating: 4.9,
    reviews: 220,
    location: "Near Jaisalmer Fort",
    price: 3500,
    image: "/images/hotel-haveli.jpg",
    amenities: ["Free Breakfast", "Courtyard Pool", "Rooftop Restaurant", "Wi-Fi"],
    description: "Experience the royal heritage of Rajasthan in an authentic 18th-century yellow sandstone haveli with intricate jharokhas and modern luxury."
  },
  {
    id: "golden-fort-palace",
    name: "Golden Fort Palace",
    rating: 4.7,
    reviews: 310,
    location: "Sadar Bazar, Jaisalmer",
    price: 4000,
    image: "/images/golden-palace.jpg",
    amenities: ["Palace Suite", "Spa & Wellness", "Fort View", "Fine Dining"],
    description: "Opulent palace rooms adorned with hand-carved stone arches, royal antique chandeliers, and hand-woven tapestries."
  },
  {
    id: "desert-view-resort",
    name: "Desert View Resort",
    rating: 4.8,
    reviews: 185,
    location: "Sam Sand Dunes",
    price: 3200,
    image: "/images/desert-resort.jpg",
    amenities: ["Dune View", "Swimming Pool", "Desert Safari", "Bar & Lounge"],
    description: "A luxury oasis situated on the perimeter of the dunes, blending traditional Rajasthani architecture with refreshing pool views."
  },
  {
    id: "royal-jaisalmer-inn",
    name: "Royal Jaisalmer Inn",
    rating: 4.7,
    reviews: 250,
    location: "City Center",
    price: 3000,
    image: "/images/royal-inn.jpg",
    amenities: ["Carved Canopies", "Cultural Lounge", "Free Pickup", "Wi-Fi"],
    description: "Cozy heritage stay featuring masterfully carved stone walls, antique furnishings, and warm Marwari hospitality."
  }
];

export const campsData: Camp[] = [
  {
    id: "royal-desert-camp",
    name: "Royal Desert Camp",
    rating: 4.8,
    reviews: 340,
    location: "Sam Sand Dunes",
    price: 2800,
    image: "/images/royal-camp.jpg",
    amenities: ["Luxury Tents", "Folk Dance & Music", "Buffet Dinner", "Camel Ride"],
    description: "The quintessential Jaisalmer desert experience with spacious Swiss tents, bonfire gatherings, and cultural performances under starlit skies."
  },
  {
    id: "luxury-swiss-camp",
    name: "Luxury Swiss Camp",
    rating: 4.9,
    reviews: 420,
    location: "Sam Sand Dunes",
    price: 3500,
    image: "/images/luxury-tent.jpg",
    amenities: ["Attached Bathroom", "AC/Heating", "Sunset Lounge", "Desert Gala"],
    description: "Premium Swiss cottage tents featuring modern plush bedding, private verandas, and panoramic sunset dune vantage points."
  },
  {
    id: "traditional-rajasthani-camp",
    name: "Traditional Rajasthani Camp",
    rating: 4.6,
    reviews: 180,
    location: "Khuri Dunes",
    price: 2200,
    image: "/images/cultural-evening.jpg",
    amenities: ["Bonfire Evening", "Traditional Dining", "Kalbelia Dance", "Stargazing"],
    description: "Escape the crowds at serene Khuri dunes with authentic village cuisine, acoustic Rajasthani folk music, and warm hospitality."
  },
  {
    id: "deluxe-desert-camp",
    name: "Deluxe Desert Camp",
    rating: 4.7,
    reviews: 310,
    location: "Sam Sand Dunes",
    price: 3000,
    image: "/images/royal-camp.jpg",
    amenities: ["Royal Canopies", "Safari Included", "Open Air Cinema", "Gourmet Meals"],
    description: "Upscale desert retreat offering luxury tents, curated dining by local chefs, and exhilarating dune excursions."
  }
];

export const toursData: Tour[] = [
  {
    id: "camel-safari",
    title: "Camel Safari",
    price: 1000,
    unit: "person",
    image: "/images/camel-safari.jpg",
    duration: "2-3 Hours",
    rating: 4.9,
    reviews: 260,
    location: "Sam Sand Dunes",
    description: "Trek deep into the golden ripples of the Thar Desert on camelback as the sun paints the sky in shades of gold and amber."
  },
  {
    id: "jeep-safari",
    title: "Jeep Safari",
    price: 1500,
    unit: "person",
    image: "/images/jeep-safari.jpg",
    duration: "1.5 Hours",
    rating: 4.8,
    reviews: 310,
    location: "Sam Sand Dunes",
    description: "High-adrenaline 4x4 dune bashing across the undulating sand dunes of Sam, guided by expert desert drivers."
  },
  {
    id: "cultural-evening",
    title: "Cultural Evening",
    price: 800,
    unit: "person",
    image: "/images/cultural-evening.jpg",
    duration: "3 Hours",
    rating: 4.7,
    reviews: 195,
    location: "Desert Camps, Sam",
    description: "Immerse in the rhythm of Rajasthan with live Kalbelia dance, soulful Manganiyar melodies, fire shows, and royal buffet dinner."
  },
  {
    id: "jaisalmer-fort-tour",
    title: "Jaisalmer Fort Tour",
    price: 1000,
    unit: "person",
    image: "/images/jaisalmer-fort-tour.jpg",
    duration: "Half Day",
    rating: 4.9,
    reviews: 420,
    location: "Fort City Center",
    description: "Guided walking tour through the living fortress of Sonar Qila, Jain temples, Raj Mahal, and ancient merchant alleys."
  },
  {
    id: "desert-photography",
    title: "Desert Photography",
    price: 1200,
    unit: "person",
    image: "/images/desert-photography.jpg",
    duration: "2 Hours",
    rating: 4.8,
    reviews: 140,
    location: "Thar Dunes & Fort",
    description: "Capture dreamlike golden hour portraits and dramatic landscape shots with our professional travel photographer."
  }
];

export const destinationsData: Destination[] = [
  {
    id: "jaisalmer-fort",
    name: "Jaisalmer Fort",
    subtitle: "The Golden Fort",
    image: "/images/dest-jaisalmer-fort.jpg",
    distance: "City Center",
    description: "A UNESCO World Heritage site and one of the very few living forts in the world, built in 1156 AD."
  },
  {
    id: "sam-sand-dunes",
    name: "Sam Sand Dunes",
    subtitle: "Desert Adventure",
    image: "/images/dest-sam-dunes.jpg",
    distance: "40 km from city",
    description: "The most popular dune destination in Jaisalmer, known for spectacular 30-meter ripples and lively night camps."
  },
  {
    id: "kuldhara-village",
    name: "Kuldhara Village",
    subtitle: "A Historic Mystery",
    image: "/images/dest-kuldhara.jpg",
    distance: "18 km from city",
    description: "An intriguing 13th-century abandoned village steeped in legend, mystery, and architectural wonder."
  },
  {
    id: "gadisar-lake",
    name: "Gadisar Lake",
    subtitle: "Serene Beauty",
    image: "/images/dest-gadisar-lake.jpg",
    distance: "2 km from fort",
    description: "A picturesque rainwater reservoir adorned with sculpted chhatris, shrines, and visiting migratory birds."
  },
  {
    id: "bada-bagh",
    name: "Bada Bagh",
    subtitle: "Royal Cenotaphs",
    image: "/images/dest-bada-bagh.jpg",
    distance: "6 km from city",
    description: "A magnificent memorial garden complex housing the golden sandstone carved cenotaphs of Maharajas."
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    city: "Delhi, India",
    avatar: "/images/avatar-priya.jpg",
    rating: 5,
    review:
      "An amazing experience! The desert camp was beautiful and the team was very helpful. Highly recommended!",
  },
  {
    id: "2",
    name: "Rahul Mehta",
    city: "Mumbai, India",
    avatar: "/images/avatar-rahul.jpg",
    rating: 5,
    review:
      "The jeep safari and cultural evening were excellent. Everything was well organized and the staff was very friendly.",
  },
  {
    id: "3",
    name: "Anjali Verma",
    city: "Bengaluru, India",
    avatar: "/images/avatar-anjali.jpg",
    rating: 5,
    review:
      "A truly memorable trip to Jaisalmer. The fort tour and camel safari were the highlights!",
  },
  {
    id: "4",
    name: "Arjun Patel",
    city: "Ahmedabad, India",
    avatar: "/images/avatar-arjun.jpg",
    rating: 5,
    review:
      "The sunset over the golden dunes was breathtaking. Our guide was knowledgeable, and the entire trip was smooth and enjoyable.",
  },
  {
    id: "5",
    name: "Neha Kapoor",
    city: "Jaipur, India",
    avatar: "/images/avatar-neha.jpg",
    rating: 5,
    review:
      "Loved the luxury desert camp, delicious Rajasthani food, and traditional folk performances. A perfect weekend getaway!",
  },
  {
    id: "6",
    name: "Vikram Singh",
    city: "Chandigarh, India",
    avatar: "/images/avatar-vikram.jpg",
    rating: 5,
    review:
      "The camel safari and Jaisalmer Fort tour were unforgettable. Great hospitality and a wonderful way to experience Rajasthan.",
  },
  {
    id: "7",
    name: "Sneha Iyer",
    city: "Chennai, India",
    avatar: "/images/avatar-sneha.jpg",
    rating: 5,
    review:
      "Everything was thoughtfully planned, from hotel arrangements to sightseeing. The desert evening was the highlight of our trip.",
  },
  {
    id: "8",
    name: "Aditya Malhotra",
    city: "Pune, India",
    avatar: "/images/avatar-aditya.jpg",
    rating: 5,
    review:
      "An incredible Jaisalmer experience! The local guides, beautiful heritage architecture, and desert adventure made our vacation special.",
  },
];

export const heroTags = [
  { label: "Heritage Hotels", icon: "Hotel" },
  { label: "Desert Camps", icon: "Tent" },
  { label: "Guided Tours", icon: "Compass" },
  { label: "Local Experiences", icon: "Sparkles" },
];

export const valueProps = [
  {
    icon: "ShieldCheck",
    title: "Best Price Guarantee",
    desc: "No hidden charges"
  },
  {
    icon: "Award",
    title: "Handpicked Properties",
    desc: "Verified stays & camps"
  },
  {
    icon: "Users",
    title: "Local Experts",
    desc: "Authentic experiences"
  },
  {
    icon: "Headphones",
    title: "24/7 Support",
    desc: "We're here for you"
  }
];

export const tharFeatures = [
  "Custom Packages",
  "Private Tours",
  "Group Bookings",
  "Honeymoon Special",
  "Family Friendly",
  "Corporate Trips"
];

export interface TravelPackage {
  id: string;
  name: string;
  duration: string;
  rating: number;
  reviews: number;
  price: number;
  image: string;
  tag?: string;
  location: string;
  description: string;
  inclusions: string[];
}

export const packagesData: TravelPackage[] = [
  {
    id: "pkg-1",
    name: "Royal Desert & Fort Odyssey",
    duration: "3 Days / 2 Nights",
    rating: 4.9,
    reviews: 142,
    price: 8499,
    image: "/images/royal-camp.jpg",
    tag: "Best Seller",
    location: "Jaisalmer Fort & Sam Dunes",
    description: "Complete royal haveli stay, luxury Swiss tent camping, camel safari, Rajasthani folk dance & campfire DJ night.",
    inclusions: ["1 Night Fort Haveli", "1 Night Luxury Camp", "Camel Safari & Dune Bashing", "All Meals & Campfire DJ"],
  },
  {
    id: "pkg-2",
    name: "Thar Honeymoon & Stargazing Special",
    duration: "4 Days / 3 Nights",
    rating: 5.0,
    reviews: 98,
    price: 14999,
    image: "/images/desert-dining.jpg",
    tag: "Romantic",
    location: "Sam Dunes & Thar Desert",
    description: "Private romantic candlelit dinner on the dunes, royal suite stay, couple sunset safari, and heritage fort tour.",
    inclusions: ["Candlelight Dune Dinner", "Private Jeep Safari", "Palace Suite & Glamping", "Personal Chauffeur"],
  },
  {
    id: "pkg-3",
    name: "Golden Triangle Desert Safari",
    duration: "2 Days / 1 Night",
    rating: 4.8,
    reviews: 210,
    price: 4999,
    image: "/images/jeep-safari.jpg",
    tag: "Popular",
    location: "Sam Dunes & Kuldhara",
    description: "Ideal weekend getaway with dune bashing, sunset camel ride, traditional buffet, and haunted village tour.",
    inclusions: ["Swiss Tent Stay", "Sunset Camel Safari", "Cultural Folk Dance", "Kuldhara Ghost Village Tour"],
  },
  {
    id: "pkg-4",
    name: "Jaisalmer Heritage & Desert Photography Tour",
    duration: "4 Days / 3 Nights",
    rating: 4.9,
    reviews: 76,
    price: 11999,
    image: "/images/hero-fort.jpg",
    tag: "Cultural",
    location: "Fort, Gadisar Lake & Sam Dunes",
    description: "Designed for culture enthusiasts & photographers with guided tours of Golden Fort, Bada Bagh, and star trails.",
    inclusions: ["Heritage Havelis & Lake", "Night Stargazing Tour", "All Entry Passes", "Local Heritage Guide"],
  },
];
