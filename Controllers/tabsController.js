import tabsModel from "../Models/tabsModel.js";
import userModel from "../Models/userModel.js";
import taskModel from "../Models/taskModel.js"

export const createTabsController = async (req, res) => {
    try {
        const { tablabel, tabcolor, Imagebackground, showlogs, is_active, is_system_generated } = req.body;
        // const is_system_generated = false;
        const userId = req.user._id;
        const existingUser = await userModel.findById(userId);
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }
        const existingTab = await tabsModel.findOne({
            // label: tablabel,
            // $or: [
            //     { person: userId },
            //     { person: null }
            // ]
            $and: [
                { label: tablabel },
                { person: userId }
            ]
        });
        if (existingTab) {
            return res.status(400).send({
                success: false,
                message: "Tab with the same label already exists",
            });
        }
        const tab = await new tabsModel({
            label: tablabel,
            color: tabcolor,
            Imagebackground,
            is_active,
            is_system_generated,
            logs: showlogs,
            person: userId
        }).save();
        console.log(tab)
        res.status(201).send({
            success: true,
            message: "Tab Successfully created",
            tab: {
                _id: tab._id,
                label: tab.label,
                color: tab.color,
                Imagebackground: tab.Imagebackground,
                is_active,
                is_system_generated,
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
};
export const getTabsController = async (req, res) => {
    try {
        const { userId } = req.params;
        const Tabs = await tabsModel.find({ person: userId }).exec();
        // const Tabs = await tabsModel.find({ $or: [{ person: userId }, { person: null }] }).exec();
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
export const getSystemTabsController = async (req, res) => {
    try {
        // const { userId } = req.params;
        const Tabs = await tabsModel.find({ person: null }).exec();
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
    const { tablabel, tabcolor, Imagebackground, is_active, is_system_generated, showlogs } = req.body;
    console.log("clg active", is_active)
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
                Imagebackground: Imagebackground || existingTab.Imagebackground,
                is_system_generated: is_system_generated || existingTab.is_system_generated,
                is_active: is_active,
                logs: showlogs
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
        if (!deletedTab) {
            return res.status(404).json({
                success: false,
                message: "Tab not found",
            });
        }
        const deletedTasks = await taskModel.deleteMany({ category: deletedTab.label });
        res.status(200).json({
            success: true,
            message: "Tab and associated tasks successfully deleted",
            tab: deletedTab,
            deletedTasks: deletedTasks.deletedCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error in deleting Tab",
            error,
        });
    }
};