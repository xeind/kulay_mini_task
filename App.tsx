import "./global.css";
import { StatusBar } from "expo-status-bar";
import { Text, View, Button, ScrollView } from "react-native";
import { CartProvider } from "./src/context/CartContext";
import { useCart } from "./src/hooks/useCart";
import { PRODUCTS } from "./src/data/products";
import { SafeAreaView } from "react-native-safe-area-context";

function CartTestScreen() {
  const { items, addItem, removeItem, clearCart, total, itemCount } = useCart();

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 bg-white">
        <View className="p-6">
          <Text className="mb-6 text-3xl font-bold text-blue-600">
            Cart Test App
          </Text>

          <Text className="mb-4 text-xl font-bold">Products</Text>

          {PRODUCTS.map((product) => (
            <View
              key={product.id}
              className="mb-3 rounded-lg border border-gray-300 bg-white p-4"
            >
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="flex-1 text-lg font-semibold">
                  {product.name}
                </Text>
                <Text className="text-lg font-bold text-gray-700">
                  ₱{product.price.toFixed(2)}
                </Text>
              </View>

              <Text className="mb-3 text-sm text-gray-600">
                {product.description}
              </Text>

              <Button
                title="Add to Cart"
                onPress={() => addItem(product)}
                color="#3b82f6"
              />
            </View>
          ))}

          <Text className="mb-4 mt-6 text-xl font-bold">Cart Items</Text>

          {items.length === 0 ? (
            <Text className="py-4 text-center text-gray-500">
              Cart is empty
            </Text>
          ) : (
            <>
              {items.map((item) => (
                <View
                  key={item.id}
                  className="mb-3 rounded-lg border border-blue-300 bg-blue-50 p-4"
                >
                  <Text className="text-lg font-semibold">{item.name}</Text>
                  <Text className="text-sm text-gray-600">
                    ₱{item.price.toFixed(2)} × {item.quantity} = ₱
                    {(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <View className="mt-2">
                    <Button
                      title="Remove"
                      onPress={() => removeItem(item.id)}
                      color="#ef4444"
                    />
                  </View>
                </View>
              ))}

              <View className="mt-4">
                <Button
                  title="Clear Cart"
                  onPress={clearCart}
                  color="#991b1b"
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {itemCount > 0 && (
        <View className="border-t border-gray-300 bg-white p-4 shadow-lg">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-lg">Cart Summary</Text>
              <Text className="text-sm text-gray-600">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Text>
              <Text className="text-2xl font-bold text-blue-600">
                ₱{total.toFixed(2)}
              </Text>
            </View>
            <Button title="View Cart" onPress={() => {}} color="#3b82f6" />
          </View>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaView className="flex-1">
      <CartProvider>
        <CartTestScreen />
      </CartProvider>
    </SafeAreaView>
  );
}
