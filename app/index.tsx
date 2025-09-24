import { Redirect } from "expo-router";

const HomeScreen = () => {
  return (
    <Redirect href="/(auth)/sign-up" />
  );
};

export default HomeScreen;  