const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
dotenv.config();
app.use(cors());

const port = process.env.PORT || 3000;

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
   
    family: 4,
})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Define schema
const employeeSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobileno: {
        type: String,
        required: true
    },role: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    
    image: {
        type: String,
        required: true
    }, degree: {
        type: String,
        required: true
    },date: {
        type: String,
        required: true
    }
});

// Define model
const UserProfile = mongoose.model("pavanDetails", employeeSchema);




// Login API call

app.post('/login', async (req, res) => {
    const { name, password } = req.body;
    try {
    //   const user = await UserProfile.findOne({ name });
      
      if (name!=="pavan") {
        return res.status(404).send({"error":"'User not found'"});
      }

    //   const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (password!=="pavan123") {
        return res.status(401).send({"error":'Invalid password'});
      }

      const token = jwt.sign({ username: name }, 'secret_key');
      res.status(200).json({ token });

    } catch (error) {
      console.error(error);
      res.status(500).send('Login failed');
    }
  });


// POST API call
app.post("/newemp", async (req, res) => {

    try {
        const {name, email, mobileno, role, gender, image, date, degree } = req.body;

        if (!email.endsWith("@gmail.com")) {
            return res.status(400).json({ message: 'Invalid email' });
        }
      
       
        const employee = new UserProfile({ name, email, mobileno, role, date, gender, image, degree});
        await employee.save();
        res.status(200).json(employee);
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET API call
app.get('/userdetails', async (req, res) => {
    try {
        const employees = await UserProfile.find(); 

        res.json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





app.put("/user/:id", async (req, res) => {
    try {
        const { name, email, mobileno, role, gender, image, date, degree  } = req.body;
        
        const update=await UserProfile.findByIdAndUpdate(req.params.id, {name, email, mobileno, role, gender, image, date, degree })
       console.log(update)
       if(!update){
        res.json({message:"not updated"})
       } else{
        res.status(200).json({message:"updated"});
       }
       
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.delete("/deleteuser/:id", async(req, res)=>{
    try{
        const deleteItem=await UserProfile.findByIdAndDelete(req.params.id,)
        res.json({message:"deleted"})
    }catch{
        res.json({message:"internal server issue"})
    }
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
