package com.cmpe275.sjsu.cartpool.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cmpe275.sjsu.cartpool.requestpojo.MessageRequest;
import com.cmpe275.sjsu.cartpool.responsepojo.CommonMessage;
import com.cmpe275.sjsu.cartpool.security.CurrentUser;
import com.cmpe275.sjsu.cartpool.security.UserPrincipal;
import com.cmpe275.sjsu.cartpool.service.UserService;

@RestController
@RequestMapping("/api/message")
public class MessageController {
	
	@Autowired
	private UserService userService;
	
	@PreAuthorize("hasRole('POOLER')")
	@PostMapping("/sendmessage")
	public CommonMessage sendEmail(@RequestBody MessageRequest messageRequest ,@CurrentUser UserPrincipal currentUser) {
		
		return userService.sendMessage(currentUser,messageRequest);
		
	}
	
}
