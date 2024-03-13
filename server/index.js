const {
  client,
  createTables,
  createUser,
  fetchUsers,
  createSkill,
  fetchSkills,
  createUserSkill,
  fetchUserSkills,
  destroyUserSkill,
} = require("./db");

const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [
    ali,
    vanessa,
    juanpablo,
    allison,
    falconry,
    breakdancing,
    telepathy,
    wizardry,
  ] = await Promise.all([
    createUser({ username: "ali", password: "123" }),
    createUser({ username: "vanessa", password: "123" }),
    createUser({ username: "juanpablo", password: "1234" }),
    createUser({ username: "allison", password: "12345" }),
    createSkill({ name: "falconry" }),
    createSkill({ name: "breakdancing" }),
    createSkill({ name: "telepathy" }),
    createSkill({ name: "wizardry" }),
  ]);

  console.log(await fetchUsers());
  console.log(await fetchSkills());

  const [aliFalconry, aliBreakdancing] = await Promise.all([
    createUserSkill({ user_id: ali.id, skill_id: falconry.id }),
    createUserSkill({ user_id: ali.id, skill_id: breakdancing.id }),
  ]);
  console.log(await fetchUserSkills(ali.id));

  // await destroyUserSkill({ user_id: juanpablo.id, id: aliFalconry.id });
  await destroyUserSkill(aliBreakdancing);

  console.log(await fetchUserSkills(ali.id));
};

init();
