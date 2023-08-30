import tabsModel from "../Models/tabsModel.js";

export const getTabsController = async (req, res) => {
    try {
        const notes = await tabsModel.find({}); // Retrieve all notes using an empty query

        res.status(200).json({
            success: true,
            message: "Successfully retrieved notes",
            notes: notes.map((note) => ({
                _id: note._id,
                title: note.title,
            })),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getting notes",
            error: error.message,
        });
    }
};
