import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useCart } from "../hooks/useCart";
import { useTheme } from "../hooks/useTheme";
import { PRODUCTS } from "../data/products";
import { useEffect, useState } from "react";
import Toast from "react-native-toast-message";

export function CartScreen() {
  const {
    items,
    addItem,
    removeItem,
    clearCart,
    total,
    itemCount,
    lastAddedItem,
    lastRemovedItem,
    incrementQuantity,
    decrementQuantity,
    applyVoucher,
    discount,
    voucherCode,
    finalTotal,
  } = useCart();

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [voucherInput, setVoucherInput] = useState("");

  useEffect(() => {
    if (lastAddedItem) {
      Toast.show({
        type: "success",
        text1: "Added to Cart!",
        text2: lastAddedItem.name,
        position: "bottom",
        visibilityTime: 2000,
        bottomOffset: 140,
      });
    }
  }, [lastAddedItem]);

  useEffect(() => {
    if (lastRemovedItem) {
      Toast.show({
        type: "error",
        text1: "Removed from Cart",
        text2: lastRemovedItem.name,
        position: "bottom",
        visibilityTime: 2000,
        bottomOffset: 140,
      });
    }
  }, [lastRemovedItem]);

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDark ? "bg-dark-bg" : "bg-amber-50"}`}
      behavior="height"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        className={`flex-1 ${isDark ? "bg-dark-bg" : "bg-amber-50"}`}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="p-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Text
              className={`text-3xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
            >
              Cart Test App
            </Text>
            <TouchableOpacity
              onPress={toggleTheme}
              activeOpacity={0.7}
              className={`rounded-2xl px-4 py-2 ${isDark ? "bg-dark-card" : "bg-white"}`}
            >
              <Text className="text-2xl">{isDark ? "☀️" : "🌙"}</Text>
            </TouchableOpacity>
          </View>

          <Text
            className={`mb-4 text-xl font-bold ${isDark ? "text-dark-text-primary" : "text-stone-900"}`}
          >
            Products
          </Text>

          {PRODUCTS.map((product) => (
            <View
              key={product.id}
              className={`mb-4 rounded-2xl p-5 ${
                isDark ? "bg-dark-card" : "bg-white"
              }`}
            >
              <View className="mb-2 flex-row items-center justify-between">
                <Text
                  className={`flex-1 text-lg font-semibold ${isDark ? "text-dark-text-primary" : "text-stone-900"}`}
                >
                  {product.name}
                </Text>
                <Text
                  className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  ₱{product.price.toFixed(2)}
                </Text>
              </View>

              <Text
                className={`mb-4 text-sm ${isDark ? "text-dark-text-secondary" : "text-stone-600"}`}
              >
                {product.description}
              </Text>

              <TouchableOpacity
                onPress={() => addItem(product)}
                activeOpacity={0.7}
                className={`rounded-2xl py-3 ${isDark ? "bg-emerald-500" : "bg-emerald-600"}`}
              >
                <Text className="text-center font-semibold text-white">
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          ))}

          <View className="mb-4 mt-6 flex-row items-center gap-2">
            <Text
              className={`text-xl font-bold ${isDark ? "text-dark-text-primary" : "text-stone-900"}`}
            >
              Cart Items
            </Text>
            {itemCount > 0 && (
              <View
                className={`rounded-lg px-2.5 py-1 ${isDark ? "bg-emerald-500" : "bg-emerald-600"}`}
              >
                <Text className="text-xs font-bold text-white">
                  {itemCount}
                </Text>
              </View>
            )}
          </View>

          {items.length === 0 ? (
            <Text
              className={`py-4 text-center ${isDark ? "text-dark-text-secondary" : "text-stone-500"}`}
            >
              Cart is empty
            </Text>
          ) : (
            <>
              {items.map((item) => (
                <View
                  key={item.id}
                  className={`mb-4 rounded-2xl p-5 ${
                    isDark ? "bg-dark-card" : "bg-white"
                  }`}
                >
                  <View className="mb-2 flex-row items-start justify-between">
                    <Text
                      className={`flex-1 text-lg font-semibold ${isDark ? "text-dark-text-primary" : "text-stone-900"}`}
                    >
                      {item.name}
                    </Text>
                    <View
                      className={`ml-3 rounded-lg px-3 py-1.5 ${isDark ? "bg-teal-500" : "bg-teal-600"}`}
                    >
                      <Text className="text-xs font-bold text-white">
                        ×{item.quantity}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`mb-3 text-sm ${isDark ? "text-dark-text-secondary" : "text-stone-600"}`}
                  >
                    ₱{item.price.toFixed(2)} × {item.quantity} = ₱
                    {(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <View className="flex-row items-center justify-between gap-2">
                    <TouchableOpacity
                      onPress={() => removeItem(item.id)}
                      activeOpacity={0.7}
                      className="rounded-2xl bg-orange-600 px-5 py-3"
                    >
                      <Text className="font-semibold text-white">Remove</Text>
                    </TouchableOpacity>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => decrementQuantity(item.id)}
                        activeOpacity={0.7}
                        className={`rounded-2xl border-2 px-5 py-2.5 ${
                          isDark
                            ? "border-dark-text-secondary"
                            : "border-stone-300"
                        }`}
                      >
                        <Text
                          className={`text-xl font-bold ${isDark ? "text-dark-text-primary" : "text-stone-700"}`}
                        >
                          −
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => incrementQuantity(item.id)}
                        activeOpacity={0.7}
                        className={`rounded-2xl px-5 py-2.5 ${isDark ? "bg-emerald-500" : "bg-emerald-600"}`}
                      >
                        <Text className="text-xl font-bold text-white">+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}

              <View className="mt-4">
                <TouchableOpacity
                  onPress={clearCart}
                  activeOpacity={0.7}
                  className="rounded-2xl bg-orange-600 py-3"
                >
                  <Text className="text-center font-semibold text-white">
                    Clear Cart
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-6">
                <Text
                  className={`mb-3 text-lg font-bold ${isDark ? "text-dark-text-primary" : "text-stone-900"}`}
                >
                  Apply Voucher
                </Text>
                {voucherCode ? (
                  <View
                    className={`rounded-2xl p-4 ${isDark ? "bg-emerald-500/20" : "bg-emerald-50"}`}
                  >
                    <Text
                      className={`text-center font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                    >
                      ✓ Voucher "{voucherCode}" applied! (10% off)
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row gap-2">
                    <TextInput
                      value={voucherInput}
                      onChangeText={setVoucherInput}
                      placeholder="Enter voucher code: DISCOUNT10"
                      placeholderTextColor={isDark ? "#78716c" : "#a8a29e"}
                      className={`flex-1 rounded-2xl border-2 px-4 py-3 ${
                        isDark
                          ? "border-dark-border bg-dark-card text-dark-text-primary"
                          : "border-stone-300 bg-white text-stone-900"
                      }`}
                    />
                    <TouchableOpacity
                      onPress={() => {
                        const success = applyVoucher(voucherInput);
                        if (success) {
                          Toast.show({
                            type: "success",
                            text1: "Voucher Applied!",
                            text2: "10% discount added",
                            position: "bottom",
                            visibilityTime: 2000,
                            bottomOffset: 140,
                          });
                          setVoucherInput("");
                        } else {
                          Toast.show({
                            type: "error",
                            text1: "Invalid Voucher",
                            text2: "Please check the code",
                            position: "bottom",
                            visibilityTime: 2000,
                            bottomOffset: 140,
                          });
                        }
                      }}
                      activeOpacity={0.7}
                      className={`rounded-2xl px-6 py-3 ${isDark ? "bg-emerald-500" : "bg-emerald-600"}`}
                    >
                      <Text className="font-semibold text-white">Apply</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {itemCount > 0 && (
        <View
          className={`border-t p-5 ${
            isDark
              ? "border-dark-border bg-dark-card"
              : "border-stone-200 bg-white"
          }`}
        >
          <View className="mb-3 flex-row items-center justify-between">
            <View>
              <Text
                className={`text-sm ${isDark ? "text-dark-text-secondary" : "text-stone-600"}`}
              >
                Subtotal
              </Text>
              <Text
                className={`text-lg font-semibold ${isDark ? "text-dark-text-primary" : "text-stone-900"}`}
              >
                ₱{total.toFixed(2)}
              </Text>
            </View>
            <View>
              <Text
                className={`text-sm ${isDark ? "text-dark-text-secondary" : "text-stone-600"}`}
              >
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Text>
            </View>
          </View>

          {discount > 0 && (
            <View className="mb-3 flex-row items-center justify-between">
              <Text
                className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
              >
                Discount (10%)
              </Text>
              <Text
                className={`text-sm font-semibold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
              >
                −₱{(total * discount).toFixed(2)}
              </Text>
            </View>
          )}

          <View
            className={`mb-3 border-t pt-3 ${isDark ? "border-dark-border" : "border-stone-200"}`}
          >
            <View className="flex-row items-center justify-between">
              <Text
                className={`text-lg font-bold ${isDark ? "text-dark-text-primary" : "text-stone-900"}`}
              >
                Total
              </Text>
              <Text
                className={`text-2xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
              >
                ₱{finalTotal.toFixed(2)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {}}
            activeOpacity={0.7}
            className={`rounded-2xl py-3 ${isDark ? "bg-emerald-500" : "bg-emerald-600"}`}
          >
            <Text className="text-center font-semibold text-white">
              Checkout
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <StatusBar style={isDark ? "light" : "dark"} />
    </KeyboardAvoidingView>
  );
}
