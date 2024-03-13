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
const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/skills", async (req, res, next) => {
  try {
    res.send(await fetchSkills());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/users/:id/userSkills", async (req, res, next) => {
  try {
    res.send(await fetchUserSkills(req.params.id));
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/users/:userId/userSkills/:id", async (req, res, next) => {
  try {
    await destroyUserSkill({ user_id: req.params.userId, id: req.params.id });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/users/:userId/userSkills", async (req, res, next) => {
  try {
    const userSkill = await createUserSkill({
      user_id: req.params.userId,
      skill_id: req.body.skill_id,
    });
    res.sendStatus(201).send(userSkill);
  } catch (ex) {
    next(ex);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status || 500).send({ error: err.message || err });
});

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

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log(`curl localhost:${port}/api/skills`);
    console.log(`curl localhost:${port}/api/users`);
    console.log(`curl localhost:${port}/api/users/${ali.id}/userSkills`);
    console.log(
      `curl -X DELETE localhost:${port}/api/users/${ali.id}/userSkills/${aliBreakdancing.id}`
    );
    console.log(
      `curl -X POST localhost:${port}/api/users/${juanpablo.id}/userSkills -d '{"skill_id": "${wizardry.id}"}' -H "Content-Type:application/json"`
    );
  });
};

init();
