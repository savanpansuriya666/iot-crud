const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

const port =  7300;

const uri = "mongodb+srv://savanpansuriya2022:Savan2022@cluster0.rdbiain.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });
//connect to mongodb
async function run() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
  } catch (err) {
    console.log(err);
  }
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello Savan here");
});

// get all the cars
app.get("/cars", async (req, res) => {
  const carItems = client.db("sp_car").collection("cars");

  const carList = await carItems.find().toArray();

  res.status(200).json(carList);
});

// add car in the list
app.post("/car/add", async (req, res) => {
  const carItems = client.db("sp_car").collection("cars");
  const { company, models, color} = req.body;

  const car = await carItems.insertOne({
    company,
    models,
    color,
  });

  res.status(201).json({ message: "New car item has been added",  car});
});

//get single car by id
app.get("/car/:id", async (req, res) => {
  const carItems = client.db("sp_car").collection("cars");
  const { id } = req.params;

  const car = await carItems.findOne({ _id: new ObjectId(id) });
  res.status(200).json(car);
});

// update car item using id
app.put("/car/:id", async (req, res) => {
  const carItems = client.db("sp_car").collection("cars");
  const { id } = req.params;
  const updatecarItem = req.body;

  const car = await carItems.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatecarItem }
  );

  res.status(200).json({ message: "car item has been updated.", car });
});

// delete the car item using id
app.delete("/car/:id", async (req, res) => {
  const carItems = client.db("sp_car").collection("cars");
  const { id } = req.params;

  await carItems.deleteOne({ _id: new ObjectId(id) });
  res.status(200).json("car item has been deleted.");
});

run()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  })