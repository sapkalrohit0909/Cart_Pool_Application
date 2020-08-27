package com.cmpe275.sjsu.cartpool.requestpojo;

public class MessageRequest {

	private String receiver;
	private String message;
	
	public MessageRequest() {
		// TODO Auto-generated constructor stub
	}
	

	public MessageRequest(String receiver, String message) {
		this.receiver = receiver;
		this.message = message;
	}


	public String getReceiver() {
		return receiver;
	}

	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}


	public String getMessage() {
		return message;
	}


	public void setMessage(String message) {
		this.message = message;
	}

	
	
}
