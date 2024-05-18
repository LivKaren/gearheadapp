import { View } from "react-native";
import {
  Button,
  Surface,
  Text,
  TextInput,
  Modal,
  Portal,
} from "react-native-paper";
import { useState } from "react";
import { styles } from "../config/styles";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [nome, setNome] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [erro, setErro] = useState({
    email: false,
    senha: false,
    repetirSenha: false,
    nome: false,
    logradouro: false,
    cep: false,
    cidade: false,
    estado: false,
  });

  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  function realizaRegistro() {
    console.log("Fazer Registro");

    if (nome === "") {
      setErro({ ...erro, nome: true });
      setErrorMessage("Nome é obrigatório.");
      showModal();
      return;
    }
    setErro({ ...erro, nome: false });

    if (email === "") {
      setErro({ ...erro, email: true });
      setErrorMessage("Email é obrigatório.");
      showModal();
      return;
    }
    setErro({ ...erro, email: false });

    if (senha === "") {
      setErro({ ...erro, senha: true });
      setErrorMessage("Senha é obrigatória.");
      showModal();
      return;
    }
    setErro({ ...erro, senha: false });

    if (repetirSenha === "") {
      setErro({ ...erro, repetirSenha: true });
      setErrorMessage("Repetir senha é obrigatório.");
      showModal();
      return;
    }
    setErro({ ...erro, repetirSenha: false });

    if (senha !== repetirSenha) {
      setErro({ ...erro, senha: true, repetirSenha: true });
      setErrorMessage("As senhas não coincidem.");
      showModal();
      return;
    }
    setErro({ ...erro, senha: false, repetirSenha: false });

    if (cep === "") {
      setErro({ ...erro, cep: true });
      setErrorMessage("CEP é obrigatório.");
      showModal();
      return;
    }
    setErro({ ...erro, cep: false });

    if (cidade === "") {
      setErro({ ...erro, cidade: true });
      setErrorMessage("Cidade é obrigatória.");
      showModal();
      return;
    }
    setErro({ ...erro, cidade: false });

    if (estado === "") {
      setErro({ ...erro, estado: true });
      setErrorMessage("Estado é obrigatório.");
      showModal();
      return;
    }
    setErro({ ...erro, estado: false });

    cadastrarNoFirebase();
  }

  /**
   * Cadastra o usuário no Firebase Authentication e salva os dados no Firestore
   *
   */
  async function cadastrarNoFirebase() {
    try {
      // Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
      // Assim que ele conseguiu criar o usuário, ele retorna o usuário
      const user = userCredential.user;

      console.log("Usuário cadastrado", user);

      // vou começar o processo de inserir os dados do usuário em uma coleção
      // no Firestore

      // pego a referência da coleção
      // como se fosse um SELECT usuarios
      // o primeiro parâmetro é a referência do banco de dados
      // quem é o DB
      const collectionRef = collection(db, "usuarios");

      // agora eu vou fazer a inserção dos dados
      // o primeiro parâmetro de setDoc é doc
      // dentro da função doc eu passo a referência da coleção
      // o terceiro é os dados que eu quero inserir
      await setDoc(
        doc(
          collectionRef, // referência da coleção "tabela"
          user.uid // id do documento "como se fosse uma chave primária"
        ),
        {
          nome: nome,
          email: email,
          logradouro: logradouro,
          cep: cep,
          cidade: cidade,
          estado: estado,
        }
      );

      // esperar setDoc terminar para redirecionar
      navigation.navigate("LoginScreen");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email já está cadastrado.");
      } else {
        setErrorMessage("Erro ao cadastrar usuário: " + error.message);
      }
      showModal();
    }
  }

  function buscaCEP() {
    console.log("Busca CEP");
    let cepLimpo = cep.replace("-", "").trim();
    if (cepLimpo.length < 8) return;
    fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      .then((res) => res.json())
      .then((dados) => {
        console.log(dados);
        setLogradouro(dados.logradouro);
        setCidade(dados.localidade);
        setEstado(dados.uf);
      })
      .catch((erro) => {
        console.error(erro);
        setErrorMessage("CEP não encontrado");
        showModal();
      });
  }

  return (
    <Surface style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Modal */}
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
          >
            <Text>{errorMessage}</Text>
            <Button onPress={hideModal}>Fechar</Button>
          </Modal>
        </Portal>
        {/* FIM Modal */}
        <Text variant="headlineSmall">Faça seu Registro</Text>
        <TextInput
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          error={erro.nome}
        />
        <TextInput
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          error={erro.email}
        />
        <TextInput
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
          error={erro.senha}
        />
        <TextInput
          placeholder="Repita sua senha"
          value={repetirSenha}
          onChangeText={setRepetirSenha}
          secureTextEntry
          style={styles.input}
          error={erro.repetirSenha}
        />
        <View style={{ paddingVertical: 20 }}>
          <Text variant="headlineSmall">Dados pessoais</Text>
          <TextInput
            placeholder="Digite seu CEP (somente números)"
            value={cep}
            onChangeText={setCep}
            onBlur={buscaCEP}
            keyboardType="numeric"
            style={styles.input}
            maxLength={8}
            error={erro.cep}
          />
          <TextInput
            placeholder="Logradouro"
            value={logradouro}
            onChangeText={setLogradouro}
            style={styles.input}
            error={erro.logradouro}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TextInput
              placeholder="Cidade"
              value={cidade}
              onChangeText={setCidade}
              style={{ ...styles.input, width: "70%" }}
              error={erro.cidade}
            />
            <TextInput
              placeholder="Estado"
              value={estado}
              onChangeText={setEstado}
              style={{ ...styles.input, width: "30%" }}
              maxLength={2}
              error={erro.estado}
            />
          </View>
        </View>
        <Button onPress={realizaRegistro} mode="outlined">
          Registrar
        </Button>
        <Button onPress={() => navigation.navigate("LoginScreen")}>
          Voltar ao login
        </Button>
      </View>
    </Surface>
  );
}
