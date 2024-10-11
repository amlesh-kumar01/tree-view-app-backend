import Item from '../models/items.model.js';
import { isValidUUID } from '../utils/uuidValidator.js';

// Create a new item
export const addItem = async (req, res) => {
  const { _id, name, quantity, category, price, godown_id, brand, attributes, image_url } = req.body;

  // Validate required fields
  if (!name || !quantity || !category || !price || !godown_id || !brand || !attributes || !image_url) {
    return res.status(400).json({ message: 'All fields are required', status: 'failure' });
  }

  // Validate UUID
  if (!isValidUUID(godown_id)) {
    return res.status(400).json({ message: 'Invalid godown ID', status: 'failure' });
  }

  // Validate item ID if it's provided
  if (_id && !isValidUUID(_id)) {
    return res.status(400).json({ message: 'Invalid item ID', status: 'failure' });
  }

  try {
    // Check if the same item is present in the same godown with the same attributes
    const existingItem = await Item.findOne({ name, category, price, godown_id, brand, attributes, image_url });
    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json({ message: 'Item quantity updated successfully', item: existingItem, status: 'success' });
    }

    // Create new item
    const newItemData = { name, quantity, category, price, godown_id, brand, attributes, image_url };
    if (_id) {
      newItemData._id = _id;
    }
    const newItem = new Item(newItemData);

    await newItem.save();
    res.status(201).json({ message: 'Item created successfully', item: newItem, status: 'success' });

  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message, status: 'failure' });
  }
};



//function to edit details of an item
export const editItem = async (req, res) => {
  const { _id } = req.params;
  const updateData = req.body;

  // Validate required fields
  if (!Object.keys(updateData).length) {
    return res.status(400).json({ message: 'At least one field is required to update', status: 'failure' });
  }

  // Validate UUIDs
  if (!isValidUUID(_id)) {
    return res.status(400).json({ message: 'Invalid item ID', status: 'failure' });
  }

  try {
    // Find the item by ID and update
    const item = await Item.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found', status: 'failure' });
    }

    res.status(200).json({ message: 'Item updated successfully', item, status: 'success' });

  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message, status: 'failure' });
  }
}

//function to add quantity to an item
export const addQuantity = async (req, res) => {
    const { _id } = req.params;
    const { quantity } = req.body;
    
    // Validate required fields
    if (!quantity) {
        return res.status(400).json({ message: 'Quantity is required', status: 'failure' });
    }
    
    // Validate UUID
    if (!isValidUUID(_id)) {
        return res.status(400).json({ message: 'Invalid item ID', status: 'failure' });
    }
    
    try {
        // Find the item by ID and update quantity
        const item = await Item.findByIdAndUpdate(
        _id,
        { $inc: { quantity } },
        { new: true, runValidators: true }
        );
        
        if (item.quantity > 0) {
            item.status = 'in_stock';
        }
        await item.save();
        if (!item) {
        return res.status(404).json({ message: 'Item not found', status: 'failure' });
        }
    
        res.status(200).json({ message: 'Quantity added successfully', item, status: 'success' });
    
    } catch (error) {
        res.status(500).json({ message: 'Error adding quantity', error: error.message, status: 'failure' });
    }
}

//function to remove quantity from an item
export const removeQuantity = async (req, res) => {
    const { _id } = req.params;
    const { quantity } = req.body;
    
    // Validate required fields
    if (!quantity) {
        return res.status(400).json({ message: 'Quantity is required', status: 'failure' });
    }
    
    // Validate UUID
    if (!isValidUUID(_id)) {
        return res.status(400).json({ message: 'Invalid item ID', status: 'failure' });
    }
    
    try {
        // Find the item by ID and update quantity
        const item = await Item.findById(_id);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found', status: 'failure' });
        }

        if (item.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity', status: 'failure' });
        }

        item.quantity -= quantity;

        if (item.quantity === 0) {
            item.status = 'out_of_stock';
        }

        await item.save();
    
        if (!item) {
        return res.status(404).json({ message: 'Item not found', status: 'failure' });
        }
    
        res.status(200).json({ message: 'Quantity removed successfully', item, status: 'success' });
    
    } catch (error) {
        res.status(500).json({ message: 'Error removing quantity', error: error.message, status: 'failure' });
    }
}

//function to view all items by godown_id
export const getItemsByGodownId = async (req, res) => {
    const { godown_id } = req.params;
    
    // Validate UUID
    if (!isValidUUID(godown_id)) {
        return res.status(400).json({ message: 'Invalid godown ID', status: 'failure' });
    }
    
    try {
        const items = await Item.find({ godown_id });
        
        if (items.length === 0) {
            return res.status(404).json({ message: 'No items found', items, status: 'failure' });
        }
    
        res.status(200).json({ message: 'Items fetched successfully', items, status: 'success' });
    
    } catch (error) {
        res.status(500).json({ message: 'Error getting items', error: error.message, status: 'failure' });
    }
}

export const getItemsByCategory = async (req, res) => {
  const { category } = req.params;

  // Validate category
  if (!category) {
    return res.status(400).json({ message: 'Category is required', status: 'failure' });
  }

  try {
    // Remove whitespace and convert to lowercase
    const formattedCategory = category.trim().toLowerCase();

    // Use a case-insensitive regex to match the category
    const items = await Item.find({ category: new RegExp(`^${formattedCategory}$`, 'i') });

    if (items.length === 0) {
      return res.status(404).json({ message: 'No items found', items, status: 'failure' });
    }

    res.status(200).json({ message: 'Items fetched successfully', items, status: 'success' });

  } catch (error) {
    res.status(500).json({ message: 'Error getting items', error: error.message, status: 'failure' });
  }
};




