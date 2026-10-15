import express from "express";

const app = express();
app.use(express.json());

let pets = [
  {
    idPet: 1,
    dsNome: "Cripto",
    dsEspecie: "cachorro",
    nuIdade: 2,
    fgAdotado: false,
  },
];

let ultimoId = 1;

//devolve o array inteiro de pets sem filtrar nada
function findAll() {
  return pets;
}

//procura um pet pelo id e devolve esse pet se nao existir com esse id devolve undefined
function findOne(id) {
  let pet = pets.find((pet) => {
    return pet.idPet === id;
  });

  return pet;
}

//cria um novo pet com id gerado pela api
function criarPet(nome, especie, idade) {
  let novoId = ultimoId + 1;
  ultimoId++;

  let novo_pet = {
    idPet: novoId,
    dsNome: nome,
    dsEspecie: especie,
    nuIdade: idade,
    fgAdotado: false,
  };

  pets.push(novo_pet);
  return novo_pet;
}

//procura o pet pelo id e altera só os campos que foram enviados
function editarPet(id, dados) {
  let pet = pets.find((pet) => {
    return pet.idPet === id;
  });

  if (!pet) {
    return null;
  }

  if (dados.dsNome !== undefined) pet.dsNome = dados.dsNome;
  if (dados.dsEspecie !== undefined) pet.dsEspecie = dados.dsEspecie;
  if (dados.nuIdade !== undefined) pet.nuIdade = dados.nuIdade;
  if (dados.fgAdotado !== undefined) pet.fgAdotado = dados.fgAdotado;

  return pet;
}

//remove um pet do array pelo id devolve true se removeu e false se nao existe
function deletarPet(id) {
  let index_pet = pets.findIndex((pet) => {
    return pet.idPet === id;
  });

  if (index_pet === -1) {
    return false;
  }

  pets.splice(index_pet, 1);
  return true;
}

//rotas sem a pasta routes, apenas testes

//devolvendo a lista de todos os pets
app.get("/pets", (req, res) => {
  const todosOsPets = findAll();
  res.json(todosOsPets);
});

//busca um pet pelo id que vem na url
app.get("/pets/:id", (req, res) => {
  const idPet = parseInt(req.params.id);

  if (isNaN(idPet)) {
    return res
      .status(400)
      .json({ mensagem: "identificador deve ser um numero" });
  }

  let pet = findOne(idPet);

  if (!pet) {
    return res.status(404).send();
  }

  res.json(pet);
});

//cadastra um novo pet
app.post("/pets", (req, res) => {
  let nome_enviado = req.body.dsNome;
  let especie_enviada = req.body.dsEspecie;
  let idade_enviada = req.body.nuIdade;

  if (!nome_enviado || !especie_enviada || idade_enviada === undefined) {
    return res.status(400).json({
      mensagem: "dados faltando, verifique nome, especie e idade",
    });
  }

  if (typeof idade_enviada !== "number" || idade_enviada < 0) {
    return res
      .status(400)
      .json({ mensagem: "idade deve ser um numero maior ou igual a 0" });
  }

  let pet_criado = criarPet(nome_enviado, especie_enviada, idade_enviada);
  return res.status(201).json(pet_criado);
});

//edita um pet pelo id, só altera os campos que foram enviados
app.patch("/pets/:id", (req, res) => {
  const idPet = parseInt(req.params.id);

  if (isNaN(idPet)) {
    return res
      .status(400)
      .json({ mensagem: "identificador deve ser um numero" });
  }

  const { dsNome, dsEspecie, nuIdade, fgAdotado } = req.body;

  if (
    dsNome === undefined &&
    dsEspecie === undefined &&
    nuIdade === undefined &&
    fgAdotado === undefined
  ) {
    return res
      .status(400)
      .json({ mensagem: "envie ao menos um campo para editar" });
  }

  if (nuIdade !== undefined && (typeof nuIdade !== "number" || nuIdade < 0)) {
    return res
      .status(400)
      .json({ mensagem: "idade deve ser um numero maior ou igual a 0" });
  }

  if (fgAdotado !== undefined && typeof fgAdotado !== "boolean") {
    return res
      .status(400)
      .json({ mensagem: "fgAdotado deve ser true ou false" });
  }

  const petEditado = editarPet(idPet, { dsNome, dsEspecie, nuIdade, fgAdotado });

  if (!petEditado) {
    return res.status(404).send();
  }

  return res.status(200).json(petEditado);
});

//remove um pet pelo id
app.delete("/pets/:id", (req, res) => {
  const idPet = parseInt(req.params.id);

  if (isNaN(idPet)) {
    return res
      .status(400)
      .json({ mensagem: "identificador deve ser um numero" });
  }

  let pet = findOne(idPet);
  if (!pet) {
    return res.status(404).send();
  }

  deletarPet(idPet);
  return res.status(204).send();
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});