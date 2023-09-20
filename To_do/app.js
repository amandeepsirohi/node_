const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-amandeep:euNpUinKlA6oDAVO@cluster0.8q5ewr8.mongodb.net/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "welcome to your to-do list"
});

const item2 = new Item({
    name: "Hit the + button to add new item"
});

const item3 = new Item({
    name: "<--- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
    Item.find().then((data) => {
        if (data.length === 0) {

            Item.insertMany(defaultItems).then(function() {
                console.log("Data inserted") // Success
            }).catch(function(error) {
                console.log(error) // Failure
            });
            res.redirect("/");
        } else {

            res.render("list", { listTitle: "Today", newListItems: data });
        }
    });
});

app.post("/", function(req, res) {

    const itemName = req.body.newItem;
    const listName = req.body.list;
    const n_item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        n_item.save();
        res.redirect("/");
    } else {
        List.findOne({ name: listName })
            .then((data) => {
                data.items.push(n_item);
                data.save();
                res.redirect("/" + listName);
            })

    }
});

app.post("/delete", (req, res) => {
    const checkId = req.body.checkbox;

    const listName = req.body.listName;

    if (listName === "Today") {
        Item.deleteOne({ _id: checkId }).then(function() {
            console.log("Checked Item Deleted"); // Success
        }).catch(function(error) {
            console.log(error); // Failure
        });
        res.redirect("/");
    }
});

app.get("/:customListName", (req, res) => {
    const customListName = req.params.customListName;
    List.findOne({ name: customListName })
        .then((data) => {
            if (!data) {
                //list don't exists create one
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
                console.log("Doesn't Exist");
            } else {
                //list already exists
                console.log("Exists");
                res.render("list", { listTitle: data.name, newListItems: data.items })
            }
        })
        .catch((err) => { /* ... */ });
});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});