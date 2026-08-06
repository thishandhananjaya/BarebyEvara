import Student from "../models/student.js";

export const getStudents = (req, res) => {
    Student.find()
        .then((students) => {
            res.json(students);
        })
        .catch((err) => {
            res.status(500).json({ message: "failed to fetch students" });
        });
};

export const addStudent = (req,res) => {
    if (req.user == null){
        res.status(403).json({message:"login to create student"})
        return
    }
     if (req.user.role != "admin"){
    res.status(403).json({message:"only admin can create Students"})
    return}




    const student = new Student({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email

    })
    student.save().then(()=>{
        res.json({ message: "student added successfully"});
    }).catch(()=>{
        res.status(500).json({ message: "failed to add student" });
    })
}