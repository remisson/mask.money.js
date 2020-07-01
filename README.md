# Money Mask

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
