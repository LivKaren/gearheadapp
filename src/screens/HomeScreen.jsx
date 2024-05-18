import { Button, Surface, Text } from "react-native-paper";
import { styles } from "../config/styles";
import { ImageBackground, Image } from "react-native";




export default function HomeScreen({ navigation }) {
  return (
    <Surface style={styles.container}>
      

      <ImageBackground
        source={require("../../assets/fundo.png")}
        style={{ width: 760,
         height: 680,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
           }}
         />
         
          

     <Text
      style={{
        marginBottom:10,
         
          justifyContent:"flex-start",
          marginLeft:0,
          zIndex:1,
          color: "rgb(255,255,255)",
          fontSize: 60 }}
      >GEARHEAD
      </Text>
      <Text
      style={{
        color: "rgb(255,255,255)",
        fontSize:12,
        marginBottom:150,
           }}>
           Melhor aplicativo para organizar sua mecânica!</Text>

      

      <Button
        onPress={() => {
          navigation.navigate("LoginScreen");
        }}
        mode="contained"

        style={{
        marginBottom:100,
        color: "rgb(139,0,0)"
           }}
      >
        COMEÇAR 
        
      </Button>
    </Surface>
  );
}

