import tabsModel from "../Models/tabsModel.js";
import userModel from "../Models/userModel.js";

export const createTabsController = async (req, res) => {
    try {
        const { tablabel, tabcolor, Imagebackground } = req.body;
        const userId = req.user._id;
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const tab = await new tabsModel({
            label: tablabel,
            color: tabcolor,
            Imagebackground,
            person: userId
        }).save();

        res.status(201).send({
            success: true,
            message: "Tab Successfully created",
            tab: {
                _id: tab._id,
                label: tab.label,
                color: tab.color,
                Imagebackground: tab.Imagebackground,
                person: tab.person,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating Tab",
            error,
        });
    }
}
export const getTabsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const Tabs = await tabsModel.find({ person: userId }).exec();
        res.status(200).send(Tabs);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error in getting Tabs",
            error: error.message,
        });
    }
};

export const updateTabController = async (req, res) => {
    const { tabId } = req.params;
    const { tablabel, tabcolor, Imagebackground } = req.body;
    try {
        const existingTab = await tabsModel.findById(tabId);
        if (!existingTab) {
            return res.status(404).json({
                success: false,
                message: "Tab not found",
            });
        }
        const updatedTab = await tabsModel.findByIdAndUpdate(
            tabId,
            {
                label: tablabel || existingTab.label,
                color: tabcolor || existingTab.color,
                Imagebackground: Imagebackground || existingTab.Imagebackground
            },
            { new: true }
        );
        console.log(updatedTab)
        res.status(200).json({
            success: true,
            message: "Tab successfully updated",
            task: updatedTab,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error updating Tab",
            error,
        });
    }
};
export const deleteTabController = async (req, res) => {
    const { tabId } = req.params;

    try {
        const deletedTab = await tabsModel.findByIdAndDelete(tabId);
        console.log(deletedTab);
        if (!deletedTab) {
            return res.status(404).json({
                success: false,
                message: "Tab not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Tab successfully deleted",
            tab: deletedTab,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in deleting Tab",
            error,
        });
    }
};