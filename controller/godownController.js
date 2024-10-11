import Godown from '../models/godowns.model.js';
import { isValidUUID} from '../utils/uuidValidator.js'; 

// Create a new godown
export const addGodown = async (req, res) => {
    const { _id, name, parent_godown } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Name is required' ,status: 'failure'});
    }
    if (parent_godown && !isValidUUID(parent_godown)) {
        return res.status(400).json({ message: 'Invalid parent_godown UUID',status: 'failure' });
    }
    try {
        const existingGodown = await Godown.findOne({ name });
        if (existingGodown) {
            return res.status(400).json({ message: 'Godown with the same name already exists',status: 'failure' });
        }
        const godownData = { name, parent_godown: parent_godown || null };
        if (_id) {
            godownData._id = _id;
        }
        const godown = new Godown(godownData);
        await godown.save();
        res.status(201).json({ message: 'Godown added successfully', godown , status: 'success'});
    } catch (error) {
        res.status(400).json({ message: "Error adding Godown",status: 'failure', error: error.message });
    }
};

// Get all godowns
export const getGodowns = async (req, res) => {
    try {
        const godowns = await Godown.find();
        if(godowns.length === 0) {
            return res.status(404).json({message: "No Godowns found", godowns, status: 'failure'});
        }
        res.status(200).json({message:"Godowns fetched successfully", godowns, status: 'success'});
    } catch (error) {
        res.status(500).json({ message: "Error getting Godowns", error: error.message , status: 'failure'});
    }
};

// Get a single godown by ID
export const getGodownById = async (req, res) => {
    try {
        const godown = await Godown.findById(req.params.id);
        if (!godown) return res.status(404).json({ message: 'Gowdown with this id does not exist' ,godown,status: 'failure'});
        res.status(200).json({ message: 'Godown fetched successfully', godown, status: 'success' });
    } catch (error) {
        res.status(500).json({ message: error.message, message: 'Error getting Godown', status: 'failure' });
    }
};

export const getGodownByParentId = async (req, res) => {
    try{
        const godowns = await Godown.find({parent_godown: req.params.id});
        if(godowns.length === 0) {
            return res.status(404).json({message: "No Godowns found", godowns, status: 'failure'});
        }
        res.status(200).json({message:"Godowns fetched successfully", godowns, status: 'success'});
    } catch(error) {
        res.status(500).json({ message: "Error getting Godowns", error: error.message , status: 'failure'});    
    }
}

export const getParentGodowns = async (req, res) => {
    try{
        const godowns = await Godown.find({parent_godown: null});
        if(godowns.length === 0) {
            return res.status(404).json({message: "No Godowns found", godowns, status: 'failure'});
        }
        res.status(200).json({message:"Godowns fetched successfully", godowns, status: 'success'});
    } catch(error) {
        res.status(500).json({ message: "Error getting Godowns", error: error.message , status: 'failure'});    
    }
}

export const changeParentGodown = async (req, res) => {
    try{
        const godown = await Godown.findById(req.params.id);
        if (!godown) return res.status(404).json({ message: 'Godown not found', status: 'failure' });
        const { parent_godown } = req.body;
        if (!parent_godown) {
            return res.status(400).json({ message: 'Parent Godown is required',status: 'failure' });
        }
        godown.parent_godown = parent_godown;
        await godown.save();
        res.status(200).json({ message: 'Godown updated successfully', godown, status: 'success' });
    }catch(error) {
        res.status(500).json({ message: "Error updating Godown", error: error.message, status: 'failure' });
    }
}

// Update a godown by ID
export const renameGodown = async (req, res) => {
    try {
        const godown = await Godown.findById(req.params.id);
        if (!godown) return res.status(404).json({ message: 'Godown not found', status: 'failure' });
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Name is required',status: 'failure' });
        }
        godown.name = name;
        await godown.save();
        res.status(200).json({ message: 'Godown updated successfully', godown, status: 'success' });
    } catch (error) {
        res.status(500).json({ message: "Error updating Godown", error: error.message, status: 'failure' });
    }
}

//Delete a godown by ID
export const deleteGodown = async (req, res) => {
    try {
      const godown = await Godown.findById(req.params.id);
      if (!godown) return res.status(404).json({ message: 'Godown not found', status: 'failure' });
  
      // Recursive function to delete child godowns
    const deleteChildGodowns = async (parentId) => {
      const childGodowns = await Godown.find({ parent_godown: parentId });
      if (childGodowns.length === 0) {
        return;
      }
      for (const child of childGodowns) {
        await deleteChildGodowns(child._id);
        await Godown.findByIdAndDelete(child._id);
      }
    };
      // Delete all child godowns first
      await deleteChildGodowns(godown._id);
  
      // Delete the parent godown
      await Godown.findByIdAndDelete(godown._id);
  
      res.status(200).json({ message: 'Godown and its children deleted successfully', status: 'success' });
    } catch (error) {
      res.status(500).json({ message: "Error deleting Godown", error: error.message, status: 'failure' });
    }
}
  