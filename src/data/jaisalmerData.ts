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
    image: "/images/hotels/hotel-haveli.jpg",
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
    image: "/images/hotels/golden-palace.jpg",
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
    image: "/images/hotels/desert-resort.jpg",
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
    image: "/images/hotels/royal-inn.jpg",
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
    image: "/images/camps/royal-camp.jpg",
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
    image: "/images/camps/luxury-tent.jpg",
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
    image: "/images/camps/cultural-evening.jpg",
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
    image: "/images/camps/royal-camp.jpg",
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
    image: "/images/activities/camel-safari.jpg",
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
    image: "/images/activities/jeep-safari.jpg",
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
    image: "/images/activities/cultural-evening.jpg",
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
    image: "/images/activities/jaisalmer-fort-tour.jpg",
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
    image: "/images/activities/desert-photography.jpg",
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
    image: "/images/contacts/contact_02.png",
    distance: "City Center",
    description: "A UNESCO World Heritage site and one of the very few living forts in the world, built in 1156 AD."
  },
  {
    id: "sam-sand-dunes",
    name: "Sam Sand Dunes",
    subtitle: "Desert Adventure",
    image: "/images/gallery_img/img-7.jpeg",
    distance: "40 km from city",
    description: "The most popular dune destination in Jaisalmer, known for spectacular 30-meter ripples and lively night camps."
  },
  {
    id: "kuldhara-village",
    name: "Kuldhara Village",
    subtitle: "A Historic Mystery",
    image: "/images/destinations/dest-kuldhara.jpg",
    distance: "18 km from city",
    description: "An intriguing 13th-century abandoned village steeped in legend, mystery, and architectural wonder."
  },
  {
    id: "gadisar-lake",
    name: "Gadisar Lake",
    subtitle: "Serene Beauty",
    image: "/images/gallery_img/img-10.jpeg",
    distance: "2 km from fort",
    description: "A picturesque rainwater reservoir adorned with sculpted chhatris, shrines, and visiting migratory birds."
  },
  {
    id: "bada-bagh",
    name: "Bada Bagh",
    subtitle: "Royal Cenotaphs",
    image: "/images/destinations/dest-bada-bagh.jpg",
    distance: "6 km from city",
    description: "A magnificent memorial garden complex housing the golden sandstone carved cenotaphs of Maharajas."
  }
];

export const testimonialsData: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    city: "Delhi, India",
    avatar: "/images/testimonials/avatar-priya.jpg",
    rating: 5,
    review:
      "An amazing experience! The desert camp was beautiful and the team was very helpful. Highly recommended!",
  },
  {
    id: "2",
    name: "Rahul Mehta",
    city: "Mumbai, India",
    avatar: "/images/testimonials/avatar-rahul.jpg",
    rating: 5,
    review:
      "The jeep safari and cultural evening were excellent. Everything was well organized and the staff was very friendly.",
  },
  {
    id: "3",
    name: "Anjali Verma",
    city: "Bengaluru, India",
    avatar: "/images/testimonials/avatar-anjali.jpg",
    rating: 5,
    review:
      "A truly memorable trip to Jaisalmer. The fort tour and camel safari were the highlights!",
  },
  {
    id: "4",
    name: "Arjun Patel",
    city: "Ahmedabad, India",
    avatar: "/images/testimonials/avatar-arjun.jpg",
    rating: 5,
    review:
      "The sunset over the golden dunes was breathtaking. Our guide was knowledgeable, and the entire trip was smooth and enjoyable.",
  },
  {
    id: "5",
    name: "Neha Kapoor",
    city: "Jaipur, India",
    avatar: "/images/testimonials/avatar-neha.jpg",
    rating: 5,
    review:
      "Loved the luxury desert camp, delicious Rajasthani food, and traditional folk performances. A perfect weekend getaway!",
  },
  {
    id: "6",
    name: "Vikram Singh",
    city: "Chandigarh, India",
    avatar: "/images/testimonials/avatar-vikram.jpg",
    rating: 5,
    review:
      "The camel safari and Jaisalmer Fort tour were unforgettable. Great hospitality and a wonderful way to experience Rajasthan.",
  },
  {
    id: "7",
    name: "Sneha Iyer",
    city: "Chennai, India",
    avatar: "/images/testimonials/avatar-sneha.jpg",
    rating: 5,
    review:
      "Everything was thoughtfully planned, from hotel arrangements to sightseeing. The desert evening was the highlight of our trip.",
  },
  {
    id: "8",
    name: "Aditya Malhotra",
    city: "Pune, India",
    avatar: "/images/testimonials/avatar-aditya.jpg",
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
  originalPrice?: number;
  category: "desert" | "family" | "honeymoon" | "heritage";
  image: string;
  tag?: string;
  location: string;
  description: string;
  inclusions: string[];
  itinerary: { day: string; title: string; desc: string }[];
}

export const packagesData: TravelPackage[] = [
  {
    id: "pkg-1",
    name: "Royal Desert & Fort Odyssey",
    duration: "3 Days / 2 Nights",
    rating: 4.9,
    reviews: 142,
    price: 8499,
    originalPrice: 10999,
    category: "desert",
    image: "/images/camps/royal-camp.jpg",
    tag: "Best Seller",
    location: "Jaisalmer Fort & Sam Dunes",
    description: "Complete royal haveli stay, luxury Swiss tent camping, camel safari, Rajasthani folk dance & campfire DJ night.",
    inclusions: [
      "1 Night Heritage Fort Haveli",
      "1 Night Luxury Swiss Camp",
      "Sunset Camel Safari & 4x4 Dune Bashing",
      "Kalbelia Dance & Campfire DJ Night",
      "All Breakfasts & Royal Rajasthani Dinners",
      "Private AC Sedan Transfers"
    ],
    itinerary: [
      { day: "Day 1", title: "Golden Fort & Haveli Heritage", desc: "Arrival pickup, check-in to heritage haveli, guided tour of Sonar Qila, Patwon ki Haveli & sunset at Gadisar Lake." },
      { day: "Day 2", title: "Desert Dunes & Cultural Night", desc: "Visit Kuldhara Ghost Village, transfer to Sam Sand Dunes, thrilling 4x4 jeep safari, sunset camel ride, evening folk show & buffet." },
      { day: "Day 3", title: "Sunrise Safari & Departure", desc: "Wake up to breathtaking sunrise over dunes, morning breakfast, visit Bada Bagh cenotaphs, and railway/airport drop." }
    ]
  },
  {
    id: "pkg-2",
    name: "Thar Honeymoon & Stargazing Special",
    duration: "4 Days / 3 Nights",
    rating: 5.0,
    reviews: 98,
    price: 14999,
    originalPrice: 18999,
    category: "honeymoon",
    image: "/images/activities/desert-dining.jpg",
    tag: "Romantic",
    location: "Sam Dunes & Thar Desert",
    description: "Private romantic candlelit dinner on the dunes, royal suite stay, couple sunset safari, and heritage fort tour.",
    inclusions: [
      "2 Nights Royal Heritage Palace Suite",
      "1 Night Premium AC Glamping Tent",
      "Private Candlelight Dune Dinner under Stars",
      "Couples Sunset Camel & 4x4 Safari",
      "Complimentary Cake, Wine & Bed Decoration",
      "Dedicated Chauffeur Driven AC Sedan"
    ],
    itinerary: [
      { day: "Day 1", title: "Royal Welcome & Lake Romance", desc: "Traditional Rajasthani welcome, suite check-in, sunset boating at Gadisar Lake and private rooftop dinner." },
      { day: "Day 2", title: "Desert Dunes & Starlight Glamping", desc: "Scenic drive through Thar desert, check-in to luxury glamping tent, private sunset camel ride and stargazing." },
      { day: "Day 3", title: "Private Dune Dinner & Folk Romance", desc: "Exclusive candlelight dinner set up amidst secluded desert dunes with private bonfire and folk musicians." },
      { day: "Day 4", title: "Morning Serenity & Farewell", desc: "Champagne breakfast in tent canopy, leisure shopping for silk shawls and handicrafts, drop at station." }
    ]
  },
  {
    id: "pkg-3",
    name: "Weekend Desert Escape",
    duration: "2 Days / 1 Night",
    rating: 4.8,
    reviews: 210,
    price: 3999,
    originalPrice: 5499,
    category: "desert",
    image: "/images/activities/jeep-safari.jpg",
    tag: "Budget Friendly",
    location: "Sam Dunes & Kuldhara",
    description: "Ideal quick weekend getaway with dune bashing, sunset camel ride, traditional buffet, and haunted village tour.",
    inclusions: [
      "1 Night Deluxe Swiss Desert Camp",
      "Sunset Camel Safari (2 riders/camel)",
      "4x4 Dune Bashing Excursion",
      "Evening Cultural Program & Campfire",
      "Buffet Dinner & Morning Breakfast",
      "Kuldhara Village Stopover"
    ],
    itinerary: [
      { day: "Day 1", title: "Arrival, Kuldhara & Dune Safari", desc: "Noon pickup from city, visit mysterious Kuldhara village, check-in to desert camp, sunset camel ride, evening dance & buffet." },
      { day: "Day 2", title: "Sunrise Dunes & City Drop", desc: "Early morning tea on the dunes, hearty breakfast, check-out and drop off at Jaisalmer railway station or fort." }
    ]
  },
  {
    id: "pkg-4",
    name: "Jaisalmer Heritage & Photography Expedition",
    duration: "4 Days / 3 Nights",
    rating: 4.9,
    reviews: 76,
    price: 11999,
    originalPrice: 14999,
    category: "heritage",
    image: "/images/banners/hero-fort.jpg",
    tag: "Cultural",
    location: "Fort, Gadisar Lake & Sam Dunes",
    description: "Designed for culture enthusiasts & photographers with guided tours of Golden Fort, Bada Bagh, and star trails.",
    inclusions: [
      "2 Nights Fort Heritage Haveli",
      "1 Night Luxury Desert Camp",
      "Sunrise & Sunset Golden Hour Photo Shoots",
      "Expert Licensed Historian Guide",
      "All Monument Entrance Tickets Included",
      "AC Vehicle for Full Sightseeing Tour Plan"
    ],
    itinerary: [
      { day: "Day 1", title: "Living Fort & Medieval Havelis", desc: "Golden hour shoot at Fort bastions, exploration of intricately carved Jain Temples, Salim Singh and Nathmal Havelis." },
      { day: "Day 2", title: "Cenotaphs & Deep Dune Camping", desc: "Morning architectural shoot at Bada Bagh cenotaphs, afternoon drive to Sam Dunes, evening star-trail astrophotography session." },
      { day: "Day 3", title: "Desert Wildlife & Kuldhara Ruins", desc: "Desert National Park chinkara & bird watching, abandoned village ruins photoshoot, evening folk portraiture." },
      { day: "Day 4", title: "Sunrise Lake Mist & Departure", desc: "Early 6:00 AM sunrise shoot across Gadisar Lake chhatris with feeding catfish, farewell breakfast and transfer." }
    ]
  },
  {
    id: "pkg-5",
    name: "Thar Family Fun & Camel Caravan",
    duration: "3 Days / 2 Nights",
    rating: 4.9,
    reviews: 115,
    price: 9499,
    originalPrice: 12499,
    category: "family",
    image: "/images/activities/thar-magic.jpg",
    tag: "Family Choice",
    location: "Jaisalmer Fort & Sam Desert",
    description: "Family-friendly tour plan with child-safe camel rides, spacious Swiss family tents, magic shows, and AC Innova travel.",
    inclusions: [
      "1 Night City Family Suite Hotel",
      "1 Night Family Swiss Tent (Attached Bath)",
      "Gentle Camel Safari & Quad Bike Experience",
      "Puppet Show, Magic Show & Folk Music",
      "Child-friendly Meals & Milk on Request",
      "Spacious AC Innova / SUV for All Transfers"
    ],
    itinerary: [
      { day: "Day 1", title: "Fort Exploration & Puppet Show", desc: "Family hotel check-in, walk through the safe fort lanes, visit Royal Palace Museum, evening puppet & cultural show for kids." },
      { day: "Day 2", title: "Desert Dunes & Fun Campfire", desc: "Drive to Sam Dunes, kids camel ride with dedicated handlers, quad bike ride, evening bonfire with folk tunes and buffet." },
      { day: "Day 3", title: "War Museum & Return", desc: "Visit Jaisalmer War Museum with military tanks and fighter jets, souvenir shopping at Sadar Bazar, station drop." }
    ]
  },
  {
    id: "pkg-6",
    name: "Maharaja Luxury Desert Glamping Retreat",
    duration: "5 Days / 4 Nights",
    rating: 5.0,
    reviews: 64,
    price: 21999,
    originalPrice: 26999,
    category: "honeymoon",
    image: "/images/banners/Dreamy_Desert_Fort_at_Sunrise.png",
    tag: "Luxury Royal",
    location: "Heritage Palaces & Dunes",
    description: "Top-tier ultra-luxury experience staying in five-star heritage palaces and royal air-conditioned mud cottages with private pool access.",
    inclusions: [
      "2 Nights 5-Star Heritage Palace Resort",
      "2 Nights Royal AC Mud Cottage / Glamping",
      "VIP Private Dune Setup with Butler Service",
      "Unlimited 4x4 Dune Bashing & Paramotoring",
      "Fine Dining Multi-Cuisine Gourmet Menus",
      "Luxury Fortuner / Mercedes Chauffeur"
    ],
    itinerary: [
      { day: "Day 1", title: "Royal Maharaja Welcome", desc: "Garland welcome and folk welcome drinks, luxury resort check-in, ayurvedic spa treatment, candlelit palace courtyard dinner." },
      { day: "Day 2", title: "Private Fort & Haveli Access", desc: "Private VIP tour of restricted royal palace chambers with palace historian, high tea on private terrace overlooking city." },
      { day: "Day 3", title: "Luxury Desert Glamping", desc: "Transfer via luxury SUV to Thar glamping enclave, plunge pool relaxation, sunset dune safari with champagne." },
      { day: "Day 4", title: "Paramotoring & Private Dune Gala", desc: "Morning paramotoring aerial flight over Thar dunes, private gala dinner with royal Rajasthani banquet and live fire artists." },
      { day: "Day 5", title: "Bespoke Shopping & Royal Sendoff", desc: "Curated artisan boutique shopping, personal souvenir gift hamper, VIP departure transfer to airport." }
    ]
  },
  {
    id: "pkg-7",
    name: "Longewala Border & Sacred Oasis Tour",
    duration: "3 Days / 2 Nights",
    rating: 4.8,
    reviews: 89,
    price: 7999,
    originalPrice: 9999,
    category: "heritage",
    image: "/images/banners/Beneath_Fort.png",
    tag: "Historic & Patriotic",
    location: "Longewala, Tanot & Sam Dunes",
    description: "Honoring 1971 war heroes at Longewala battlefield, miraculous Tanot Mata temple, and majestic Sam dunes camp.",
    inclusions: [
      "1 Night City Heritage Hotel",
      "1 Night Desert Camp at Sam Dunes",
      "Excursion to Longewala War Memorial (120 km)",
      "Darshan at Miraculous Tanot Mata Mandir",
      "Sunset Camel Safari & Rajasthani Folk Night",
      "Dedicated AC SUV with Military Guide History"
    ],
    itinerary: [
      { day: "Day 1", title: "Fort City & Heritage Sights", desc: "Pickup from station, check-in, explore Jaisalmer Fort, Bada Bagh and sunset at Vyas Chhatri." },
      { day: "Day 2", title: "Longewala Border & Desert Camp", desc: "Early morning drive to Tanot Mata Temple and Longewala 1971 battle ground with captured tanks. Evening drive to Sam camp for dinner." },
      { day: "Day 3", title: "Desert Sunrise & Departure", desc: "Morning camel ride on dunes, breakfast at camp, return to Jaisalmer city for market shopping and train drop." }
    ]
  },
  {
    id: "pkg-8",
    name: "Group Adventure & 4x4 Dune Bashing",
    duration: "2 Days / 1 Night",
    rating: 4.9,
    reviews: 178,
    price: 4499,
    originalPrice: 5999,
    category: "desert",
    image: "/images/activities/cultural-evening.jpg",
    tag: "Adventure Thrill",
    location: "Sam Sand Dunes & Ghost Town",
    description: "Ideal for friends & adventure groups: extreme 4x4 dune bashing, quad biking, campfire DJ party, and desert camping.",
    inclusions: [
      "1 Night Swiss Tent Camping (Triple/Quad Sharing)",
      "High-Adrenaline 4x4 Jeep Dune Bashing",
      "Sunset Camel Safari on High Sand Dunes",
      "Open Air Campfire & DJ Dancing Night",
      "Rajasthani Buffet Dinner & Unlimited Snacks",
      "Group AC Tempo Traveller / SUV Pickup"
    ],
    itinerary: [
      { day: "Day 1", title: "Dune Bashing & Campfire Party", desc: "Afternoon group pickup, thrilling 4x4 jeep safari across high sand crests, sunset camel race, DJ campfire dance party and feast." },
      { day: "Day 2", title: "Morning Sand Sports & Return", desc: "Early morning dune volleyball and photography, hearty breakfast, visit haunted Kuldhara ruins on way back, drop at city." }
    ]
  }
];
