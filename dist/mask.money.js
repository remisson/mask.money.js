/*
@author Remisson dos Santos Silva
@since 27/09/2016 16:47

Money Mask with Zero Allowed

	Example: 1.100.222,0200

	<input type="text" onkeypress="return mask_money_zero_allowed(this,4,'.',',',7,event);"></input>

- Parameters

	element - Html Input element
	precision - How many decimal places are allowed
	thousands - The thousands separator. Example: ',' or '.'
	decimal - The decimal separator. Example: ',' or '.'
	maxlength - Html Input maximum length attribute
	event - Event instance
*/
var mask_money_zero_allowed = function(element,precision,thousands,decimal,maxlength,event)
{
	var whichCode = (window.event) ? event.keyCode : event.which;

	if (whichCode == 13 || whichCode == 37 || whichCode == 39)
		return false;
	if (whichCode == 0 || whichCode == 8)
		return true;
	if ('0123456789'.indexOf(String.fromCharCode(whichCode)) == -1)
		return false;

	var mask = new MoneyMaskZeroAllowed(element,precision,thousands,decimal,maxlength,whichCode);
	mask.apply();

	return false;
};

function MoneyMaskZeroAllowed(element,precision,thousands,decimal,maxlength,whichCode)
{
	this.element = element;
	this.precision = precision;
	this.thousands = thousands;
	this.decimal = decimal;
	this.maxlength = maxlength;
	this.whichCode = whichCode;
	this.pressed_key = String.fromCharCode(whichCode);
}

MoneyMaskZeroAllowed.prototype.apply = function()
{
	if(this.is_maxlength_valid())
	{
		this.load_value_to_verify();
		this.load_thousands_and_decimal_values();

		if(this.is_movimentation_necessary())
		{
			if(this.is_thousands_values_zero())
				this.override_thousands_values_to_pressed_key();
			else
			{
				this.move_first_decimal_value_to_thousands_values();
			}
			this.load_thousand_with_symbols();
			this.load_final_value();
			this.set_final_value_on_element();
		}
		else
		{
			this.set_value_to_verify_on_element();
		}
	}
};

MoneyMaskZeroAllowed.prototype.set_value_to_verify_on_element = function()
{
	this.element.value = this.value_to_verify;
};

MoneyMaskZeroAllowed.prototype.set_final_value_on_element = function()
{
	this.element.value = this.final_value;
};

MoneyMaskZeroAllowed.prototype.load_final_value = function()
{
	this.final_value = this.thousand_with_symbols +this.decimal+this.decimal_values;
};

MoneyMaskZeroAllowed.prototype.load_thousand_with_symbols = function()
{
	this.thousand_with_symbols = '';

	var char_array = new String(this.thousands_values).split("");

	var position_count = 0;

	for(var i=0,y=(char_array.length - 1);i<this.thousands_values.length;i++,y--)
	{
		var current_char = char_array[y];

		if(position_count == 3)
		{
			this.thousand_with_symbols = current_char + this.thousands + this.thousand_with_symbols;
			position_count = 0;
		}
		else
			this.thousand_with_symbols = current_char + this.thousand_with_symbols;
		
		position_count++;
	}
};

MoneyMaskZeroAllowed.prototype.move_first_decimal_value_to_thousands_values = function()
{
	this.thousands_values += this.decimal_values.charAt(0);
	this.remove_first_decimal_value();
};

MoneyMaskZeroAllowed.prototype.remove_first_decimal_value = function()
{
	this.decimal_values = this.decimal_values.substring(1,this.decimal_values.length);
};

MoneyMaskZeroAllowed.prototype.override_thousands_values_to_pressed_key = function()
{
	this.thousands_values = "";
	this.thousands_values += this.decimal_values.charAt(0);
	this.remove_first_decimal_value();
};

MoneyMaskZeroAllowed.prototype.is_thousands_values_zero = function()
{
	return this.thousands_values == "0";
};

MoneyMaskZeroAllowed.prototype.is_movimentation_necessary = function()
{
	return this.decimal_values.length > this.precision;
};

MoneyMaskZeroAllowed.prototype.load_value_to_verify = function()
{
	this.value_to_verify = this.element.value;
	if(this.element.value == null || this.element.value == undefined || this.element.value == "")
		this.value_to_verify = "0,";
	this.value_to_verify += this.pressed_key;
};

MoneyMaskZeroAllowed.prototype.load_thousands_and_decimal_values = function()
{
	var temp_array = new String(this.value_to_verify).split(this.decimal);
	this.thousands_values = this.get_normalized_value(temp_array[0]);
	this.decimal_values = this.get_normalized_value(temp_array[1]);
};

MoneyMaskZeroAllowed.prototype.get_normalized_value = function(value)
{
	return value.replace(/\./g, "").replace(/\,/g, "");
};

MoneyMaskZeroAllowed.prototype.is_maxlength_valid = function()
{
	return this.element.value != undefined && this.element.value != null
		? this.get_normalized_value(this.element.value).length + 1 <= this.maxlength : true;
};
