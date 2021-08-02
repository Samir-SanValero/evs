package com.fenomatch.evsclient.config.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.fenomatch.evsclient.embryoanalysis.controller.EmbryoStatusController;

@RestController
public class ConfigController {
	
	private static final Logger log = LoggerFactory.getLogger(ConfigController.class);
	
	
	public static String CONFIG_KEY_EMBRYOSELECTION_GRID_COLUMNS = "EMBRYOSELECTION_GRID_COLUMNS";
	public static String CONFIG_KEY_EMBRYOSELECTION_GRID_ROWS = "EMBRYOSELECTION_GRID_ROWS";
	public static String CONFIG_KEY_TIMELINE_TIME_MARGIN_DOUBLE_CLICK = "TIMELINE_DOUBLE_CLICK_MARGIN_TIME";
	public static String CONFIG_KEY_TIME_HEADER_NOTIFICATIONS = "CONFIG_KEY_TIME_HEADER_NOTIFICATIONS";
	
	@Value("${screen.embryoselection.grid.columns}")
    private Integer embryo_selection_grid_columns;
	
	@Value("${screen.embryoselection.grid.rows}")
	private Integer embryo_selection_grid_rows;
	
	@Value("${timeline.doubleclick.margin}")
	private Integer timeline_doubleclick_margin;
	
	@Value("${header.notifications.time}")
	private Integer header_notifications_time;
	
	
	@CrossOrigin(origins = {"http://localhost:4200"})
	@RequestMapping(value="config/getConfig", method = RequestMethod.GET, produces = "application/json")
	public Map <String, String> getConfiguration () {
		Map <String, String> result = new HashMap <String, String>(); 
		result.put(ConfigController.CONFIG_KEY_EMBRYOSELECTION_GRID_COLUMNS, this.embryo_selection_grid_columns.toString());
		result.put(ConfigController.CONFIG_KEY_EMBRYOSELECTION_GRID_ROWS, this.embryo_selection_grid_rows.toString());
		result.put(ConfigController.CONFIG_KEY_TIMELINE_TIME_MARGIN_DOUBLE_CLICK, this.timeline_doubleclick_margin.toString());
		result.put(ConfigController.CONFIG_KEY_TIME_HEADER_NOTIFICATIONS, this.header_notifications_time.toString());
		return result;
	}
	
}
