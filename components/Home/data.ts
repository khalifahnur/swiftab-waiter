const placeholderData = [
  {
    restaurantId: "resto_12345",
    userId: "user_67890",
    reservationId: "res_98765",
    paid: "paid",
    served: true,
    menu: [
      {
        name: "Grilled Chicken Salad",
        description:
          "Freshly grilled chicken served on a bed of crisp greens with a tangy vinaigrette.",
        amount: 1200,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006040/menu/red2m0vha6pltrxeqrue.png",
        quantity: 2,
      },
      {
        name: "Lemon Garlic Butter Salmon",
        description:
          "Grilled salmon served with a zesty lemon garlic butter sauce.",
        amount: 1500,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006092/menu/xiedbk5qwdpx6jz3bw7g.png",
        quantity: 1,
      },
      {
        name: "Caesar Salad",
        description:
          "Crisp romaine lettuce, croutons, and Parmesan cheese with Caesar dressing",
        amount: 1500,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006152/menu/s9sspskkik5joku0sycc.png",
        quantity: 1,
      },
    ],
    floor: 1,
    tableNumber: 5,
  },
  {
    restaurantId: "resto_23456",
    userId: "user_78901",
    reservationId: "res_87654",
    paid: "unpaid",
    served: false,
    menu: [
      {
        name: "Margherita Pizza",
        description:
          "Classic pizza topped with fresh mozzarella, tomatoes, and basil.",
        amount: 800,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006432/menu/opowtxfamuj3sthsed8x.png",
        quantity: 1,
      },
    ],
    floor: 2,
    tableNumber: 12,
  },
  {
    restaurantId: "resto_34567",
    userId: "user_89012",
    reservationId: "res_76543",
    paid: "paid",
    served: false,
    menu: [
      {
        name: "Beef Burger",
        description:
          "Juicy beef patty with lettuce, tomato, and cheese in a toasted bun.",
        amount: 600,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006284/menu/ggkzmeoxksmpx6cbneot.png",
        quantity: 3,
      },
    ],
    floor: 3,
    tableNumber: 7,
  },
  {
    restaurantId: "resto_45678",
    userId: "user_90123",
    reservationId: "res_65432",
    paid: "unpaid",
    served: true,
    menu: [
      {
        name: "Spaghetti Carbonara",
        description:
          "Pasta tossed with a creamy sauce, crispy bacon, and Parmesan cheese.",
        amount: 1100,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006246/menu/bdgvtay9qd1krinwgyn7.png",
        quantity: 1,
      },
    ],
    floor: 1,
    tableNumber: 10,
  },
  {
    restaurantId: "resto_56789",
    userId: "user_01234",
    reservationId: "res_54321",
    paid: "paid",
    served: true,
    menu: [
      {
        name: "Caesar Salad",
        description:
          "Crisp romaine lettuce, croutons, and Parmesan cheese with Caesar dressing.",
        amount: 900,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006217/menu/qztpszqbs1zkbdyhdcrh.png",
        quantity: 2,
      },
    ],
    floor: 2,
    tableNumber: 3,
  },
  {
    restaurantId: "resto_67890",
    userId: "user_12345",
    reservationId: "res_43210",
    paid: "unpaid",
    served: false,
    menu: [
      {
        name: "Lemon Garlic Butter Salmon",
        description:
          "Grilled salmon served with a zesty lemon garlic butter sauce.",
        amount: 1500,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006400/menu/zzcwkd4usgn1vtzutzkr.png",
        quantity: 1,
      },
      {
        name: "Caesar Salad",
        description:
          "Crisp romaine lettuce, croutons, and Parmesan cheese with Caesar dressing",
        amount: 1500,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006365/menu/y3g8gobzqgotkgixv45s.png",
        quantity: 1,
      },
    ],
    floor: 3,
    tableNumber: 15,
  },
];

export default placeholderData;
