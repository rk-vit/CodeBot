import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import env from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const   
 port = 3000;
const app = express();

app.use(express.static(__dirname   
 + "/public"));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(bodyParser.urlencoded({ extended:   
 true }));

env.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: { responseMimeType: "application/json" },
});

app.get("/", async (req, res) => {
  res.render("index.ejs", { output: "Enter the theme HTML code and write the Content to integrate the code" });
});

app.post("/theme", async (req, res) => {
  const theme = req.body.theme;
  const content = req.body.content;

  const prompt = `
    I Have the HTML Theme :- ${theme} and a text of required contnent :- ${content}, now generate an HTML page with the content shown in the style of the “Theme” using this json schema: 
    { "type":"object",
      "properties":{
        "code":{"type":"string"},
        "explanation_text:{"type":"string"}
      }
    }
  `;

  const result = await model.generateContent(prompt);

  // Parse the response text as JSON to access the code property
  const responseObject = JSON.parse(result.response.text());
  const code = responseObject.code;

  res.render("index.ejs", { output: code }); // Pass only the code
});

app.get("/changes", (req, res) => {
  res.render("index2.ejs", { output: "Enter the code and write the changes you want to get the modified code" });
});

app.post("/changes", async (req, res) => {
    const code = req.body.code;
    const changes = req.body.changes;
    const prompt = `I Have some code :- ${code} and a text explaining the changes i want :- ${changes}, now generate the code with changes made `;
    const result = await model.generateContent(prompt);
    let responseCode;
    try {
      const responseObject = JSON.parse(result.response.text());
      responseCode = responseObject.code;
    } catch (error) {
      console.error("Error parsing response:", error);
      responseCode = "An error occurred while processing your request.";
    }
    res.render("index.ejs", { output: responseCode }); // Pass only the code
  });

app.listen(port, (req, res) => {
  console.log(`Listening in port ${port}`);
});