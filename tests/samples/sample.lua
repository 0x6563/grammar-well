require("INC_Class.lua")

cAnimal=setclass("Animal")

function cAnimal.methods:init(action, cutename) 
	self.superaction = action
	self.supercutename = cutename
end