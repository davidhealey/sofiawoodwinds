namespace controllerEditor
{
	inline function onInitCB()
	{
		const var parameters = ["Velocity", "Expression", "Dynamics", "Vibrato Depth", "Vibrato Rate"];
		const var userCc = [-1, 11, 1, 20, 21]; //User assigned controllers
		const var realCc = [-1, 11, 1, 20, 21]; //Real CCs forwarded internally. -1 = velocity

		const var cmbParam = Content.getComponent("cmbParam");
		ui.comboBoxPanel("cmbParam", paintRoutines.comboBox, parameters);

		const var cmbCc = []; //Controller number selection combo boxes
		const var tblCc = []; //Controller value tables

		for (i = 0; i < parameters.length; i++)
		{
			//Controller selection
			cmbCc[i] = Content.addPanel("cmbCc"+i, 90, 80);
			Content.setPropertiesFromJSON("cmbCc"+i, {width:100, height:25, parentComponent:"pnlRightZone"});
			ui.comboBoxPanel("cmbCc"+i, paintRoutines.comboBox, ccNums);
	
			//Response table
			tblCc[i] = Content.addTable("tblCc"+i, 10, 115);
			Content.setPropertiesFromJSON("tblCc"+i, {width:180, height:95, parentComponent:"pnlRightZone"});
		}
		
		const var pnlTblBg = Content.getComponent("pnlTblBg"); //Table background colour panel
		pnlTblBg.setPaintRoutine(function(g){g.fillAll(Theme.TABLE.bg);});
		
	}
	
	inline function onNoteCB()
	{
		Message.setVelocity(Math.max(1, 127 * tblCc[0].getTableValue(Message.getVelocity()))); //Scale velocity according to table
	}
	
	inline function onControllerCB()
	{
		local n = Message.getControllerNumber();
		local v = Message.getControllerValue();
		
		if (userCc.contains(n)) //User defined CC triggered the callback
		{
			Message.ignoreEvent(true); //I'll take it from here
			
			for (i = 0; i < parameters.length; i++) //Each parameter
			{
				if (realCC[i] < 0) continue; //Ignore internal modulators
				
				if (n == cmbCc[i].getValue()) //CC has been assigned to this parameter
				{
					//Scale and forward value to real CC
					Synth.sendController(realCc[i], 127 * tblCc[i].getTableValue(v));
				}
			}
		}
		else if (realCc.contains(n)) //Real CCs should only ever be controlled via User CCs
		{
			Message.ignoreEvent(true);
		}
	}
	
	inline function onControlCB(number, value)
	{
		if (number == cmbParam)
		{
			for (i = 0; i < parameters.length; i++)
			{
				cmbCc[i].set("visible", false);
				tblCc[i].set("visible", false);
			}
			cmbCc[value-1].set("visible", true);
			tblCc[value-1].set("visible", true);
		}
		else 
		{
			for (i = 0; i < parameters.length; i++)
			{
				if (number == cmbCc[i])
				{
					if (realCc[i] != -1) //Velocity (ui control should be disabled anyway)
					{
						userCc[i] = value;
					}
					break; //Exit loop
				}
			}
		}
	}
}