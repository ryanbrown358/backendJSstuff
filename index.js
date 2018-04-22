const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const courses = [
    { id: 1, name: 'course1'},
    { id: 2 , name: 'course2'},
    { id: 3, name: 'course3'}
];

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.get('/api/courses', (req, res) => {
   res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if(error)  return res.status(400).send(error.details[0].message); // 404 error
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// /api/courses/1
app.get('/api/customers/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("The course with the given ID was not found"); // 404
    res.send(course);
});


// update the course 
app.put('/api/courses/:id', (req, res) => {
    // look up the course
    // if not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)    return res.status(404).send("The course with the given ID was not found"); // 404
       
    

    // validate
    // if invalid, return 400 - Bad request
    const { error } = validateCourse(req.body);
    if(error) return res.status(400).send(error.details[0].message); // 400 Bad Request

    // update the course
    course.name = req.body.name;
    // return the updated course to the client 
    res.send(course);
});


app.delete('/api/courses/:id', (req, res) => {
    // look up the course
    // not existing, return 404
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) return res.status(404).send("The course with the given ID was not found"); // 404

    // delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    // return the same course
    res.send(course); 
});



const validateCourse = (course) => {
    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course, schema);

}



// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));