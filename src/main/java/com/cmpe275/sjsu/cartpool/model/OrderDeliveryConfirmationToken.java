package com.cmpe275.sjsu.cartpool.model;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
public class OrderDeliveryConfirmationToken {
	 	@Id
	    @GeneratedValue(strategy = GenerationType.AUTO)
	    @Column(name="id")
	    private long tokenid;

	    @Column(name="confirmation_token")
	    private String confirmationToken;

	    @Temporal(TemporalType.TIMESTAMP)
	    private Date createdDate;

	    @OneToOne(targetEntity = Orders.class, fetch = FetchType.EAGER)
	    @JoinColumn(nullable = false, name = "order_id")
	    private Orders order;
	    
	    public OrderDeliveryConfirmationToken() {
		
		}
	    public OrderDeliveryConfirmationToken(Orders order) {
	        this.order = order;
	        createdDate = new Date();
	        confirmationToken = UUID.randomUUID().toString();
	    }

		public long getTokenid() {
			return tokenid;
		}

		public void setTokenid(long tokenid) {
			this.tokenid = tokenid;
		}

		public String getConfirmationToken() {
			return confirmationToken;
		}

		public void setConfirmationToken(String confirmationToken) {
			this.confirmationToken = confirmationToken;
		}

		public Date getCreatedDate() {
			return createdDate;
		}

		public void setCreatedDate(Date createdDate) {
			this.createdDate = createdDate;
		}
		public Orders getOrder() {
			return order;
		}
		public void setOrder(Orders order) {
			this.order = order;
		}

		
	    
}
