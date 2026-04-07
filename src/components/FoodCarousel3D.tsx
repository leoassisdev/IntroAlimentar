const FOOD_ITEMS = [
  { emoji: "🍎", label: "Maçã" },
  { emoji: "🥕", label: "Cenoura" },
  { emoji: "🍌", label: "Banana" },
  { emoji: "🥦", label: "Brócolis" },
  { emoji: "🥑", label: "Abacate" },
  { emoji: "🍊", label: "Laranja" },
  { emoji: "🫐", label: "Mirtilo" },
  { emoji: "🍐", label: "Pêra" },
  { emoji: "🥭", label: "Manga" },
  { emoji: "🍠", label: "Batata Doce" },
];

const FoodCarousel3D = () => {
  const quantity = FOOD_ITEMS.length;

  return (
    <div className="carousel-3d-wrapper">
      <div className="carousel-3d-inner">
        {FOOD_ITEMS.map((food, index) => (
          <div
            key={food.label}
            className="carousel-3d-card"
            style={{
              "--quantity": quantity,
              "--index": index,
              transform: `rotateY(calc((360deg / ${quantity}) * ${index})) translateZ(180px)`,
            } as React.CSSProperties}
          >
            <span>{food.emoji}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodCarousel3D;
