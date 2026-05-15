const { Branch, User } = require('../models/simpleDB');

async function selectBranch(bot, msg) {
  const chatId = msg.chat.id;
  
  try {
    const branches = await Branch.findAll();
    
    if (branches.length === 0) {
      await bot.sendMessage(chatId, '❌ No branches configured. Please contact admin.');
      return;
    }
    
    const keyboard = {
      reply_markup: {
        inline_keyboard: branches.map(branch => [
          { text: `🏪 ${branch.name}`, callback_data: `branch_${branch.id}` }
        ])
      }
    };
    
    await bot.sendMessage(chatId, '🏪 Select your branch:', keyboard);
    
  } catch (error) {
    console.error('Error fetching branches:', error);
    await bot.sendMessage(chatId, '❌ Error loading branches. Please try again.');
  }
}

async function handleBranchSelection(bot, query) {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const branchId = parseInt(query.data.replace('branch_', ''));
  
  try {
    const branch = await Branch.findById(branchId);
    
    if (!branch) {
      await bot.answerCallbackQuery(query.id, { text: 'Branch not found!' });
      return;
    }
    
    // Update user's current branch
    await User.upsert({
      telegramId: userId,
      username: query.from.username,
      firstName: query.from.first_name,
      currentBranchId: branchId
    });
    
    await bot.answerCallbackQuery(query.id, { text: `Selected: ${branch.name}` });
    await bot.sendMessage(chatId, 
      `✅ Branch set to: **${branch.name}**\n\n` +
      `You can now record payments for this branch.`,
      { parse_mode: 'Markdown' }
    );
    
  } catch (error) {
    console.error('Error selecting branch:', error);
    await bot.answerCallbackQuery(query.id, { text: 'Error selecting branch' });
  }
}

module.exports = {
  selectBranch,
  handleBranchSelection
};
