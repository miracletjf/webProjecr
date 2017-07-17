function ScrollText(content,autoStart,timeout,isSmoothScroll)
{
    this.Speed = 1000;
    this.Timeout = timeout;
	this.stopscroll = false;
	this.isSmoothScroll= isSmoothScroll;
    this.LineHeight = 20;
    this.ScrollContent = this.$(content);
	//如果数据不满可滚动要求,不滚动
	if(this.ScrollContent.scrollHeight > this.ScrollContent.clientHeight){
		    this.ScrollContent.innerHTML += this.ScrollContent.innerHTML;
	}
    this.ScrollContent.onmouseover = this.GetFunction(this,"MouseOver");
    this.ScrollContent.onmouseout = this.GetFunction(this,"MouseOut");

    if(autoStart)
    {
        this.Start();
    }
}
ScrollText.prototype = {

	$:function(element)
	{
		return document.getElementById(element);
	},
	Start:function()
	{
		if(this.isSmoothScroll)
		{
			this.AutoScrollTimer = setInterval(this.GetFunction(this,"SmoothScroll"), this.Timeout);
		}
		else
		{		
			this.AutoScrollTimer = setInterval(this.GetFunction(this,"AutoScroll"), this.Timeout);
		}
	},
	Stop:function()
	{
		clearTimeout(this.AutoScrollTimer);
		this.DelayTimerStop = 0;
	},
	AutoScroll:function()
	{
		if(this.stopscroll) 
		{
			return;
		}
		this.ScrollContent.scrollTop += 10;
		if(parseInt(this.ScrollContent.scrollTop) % this.LineHeight != 0)
		{
			this.ScrollTimer = setTimeout(this.GetFunction(this,"AutoScroll"), this.Speed);
		}
		else
		{
			if(parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2)
			{
				this.ScrollContent.scrollTop = 0;
			}
			clearTimeout(this.ScrollTimer);
			//this.AutoScrollTimer = setTimeout(this.GetFunction(this,"AutoScroll"), this.Timeout);
		}
	},
	SmoothScroll:function()
	{
		if(this.stopscroll) 
		{
			return;
		}
		this.ScrollContent.scrollTop++;
		if(parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2)
		{
			this.ScrollContent.scrollTop = 0;
		}
	},
	Scroll:function(direction)
	{

		if(direction=="up")
		{
			this.ScrollContent.scrollTop -= 10;
		}
		else
		{
			this.ScrollContent.scrollTop+= 10;
		}
		if(parseInt(this.ScrollContent.scrollTop) >= parseInt(this.ScrollContent.scrollHeight) / 2)
		{
			this.ScrollContent.scrollTop = 0;
		}
		else if(parseInt(this.ScrollContent.scrollTop)<=0)
		{
			this.ScrollContent.scrollTop = parseInt(this.ScrollContent.scrollHeight) / 2;
		}
		
		if(parseInt(this.ScrollContent.scrollTop) % this.LineHeight != 0)
		{
			this.ScrollTimer = setTimeout(this.GetFunction(this,"Scroll",direction), this.Speed);
		}
	},
	GetFunction:function(variable,method,param)
	{
		return function()
		{
			variable[method](param);
		}
	}
}

function ignoreError() {
  return true;
}
window.onerror = ignoreError; 