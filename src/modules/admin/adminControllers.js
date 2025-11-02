const makeAdmin = async (req, res) => {
    const { email } = req.params;
    try {
        const result = await userModel.findOneAndUpdate(
            { email },
            { role: "admin" },
            { new: true }
        );
        if (!result) return res.status(404).send({ message: "User not found" });
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: "Failed to make admin", error: err });
    }
};
const removeAdmin = async (req, res) => {
    const { email } = req.params;
    try {
        const result = await userModel.findOneAndUpdate(
            { email },
            { role: "user" },
            { new: true }
        );
        if (!result) return res.status(404).send({ message: "User not found" });
        res.send(result);
    } catch (err) {
        res.status(500).send({ message: "Failed to remove admin", error: err });
    }
};


module.exports = { makeAdmin, removeAdmin }