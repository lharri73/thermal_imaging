
# -*- coding: utf-8 -*-

from remi.gui import *
from remi import start, App


class untitled(App):
    def __init__(self, *args, **kwargs):
        #DON'T MAKE CHANGES HERE, THIS METHOD GETS OVERWRITTEN WHEN SAVING IN THE EDITOR
        if not 'editing_mode' in kwargs.keys():
            super(untitled, self).__init__(*args, static_file_path={'my_res':'./res/'})

    def idle(self):
        #idle function called every update cycle
        pass
    
    def main(self):
        return untitled.construct_ui(self)
        
    @staticmethod
    def construct_ui(self):
        #DON'T MAKE CHANGES HERE, THIS METHOD GETS OVERWRITTEN WHEN SAVING IN THE EDITOR
        container0 = Container()
        container0.attr_class = "Container"
        container0.attr_editor_newclass = False
        container0.css_height = "250px"
        container0.css_left = "15px"
        container0.css_position = "absolute"
        container0.css_top = "165px"
        container0.css_width = "1000px"
        container0.variable_name = "container0"
        button0 = Button()
        button0.attr_class = "Button"
        button0.attr_editor_newclass = False
        button0.css_font_size = "16px"
        button0.css_height = "32px"
        button0.css_left = "797px"
        button0.css_position = "absolute"
        button0.css_top = "217px"
        button0.css_width = "200px"
        button0.text = "Get Video Feed"
        button0.variable_name = "button0"
        container0.append(button0,'button0')
        button1 = Button()
        button1.attr_class = "Button"
        button1.attr_editor_newclass = False
        button1.css_font_size = "16px"
        button1.css_height = "32px"
        button1.css_left = "594px"
        button1.css_position = "absolute"
        button1.css_top = "217px"
        button1.css_width = "200px"
        button1.text = "Edit Alert Contacts"
        button1.variable_name = "button1"
        container0.append(button1,'button1')
        button2 = Button()
        button2.attr_class = "Button"
        button2.attr_editor_newclass = False
        button2.css_font_size = "16px"
        button2.css_height = "32px"
        button2.css_left = "391px"
        button2.css_position = "absolute"
        button2.css_top = "217px"
        button2.css_width = "200px"
        button2.text = "Regions of Interest"
        button2.variable_name = "button2"
        container0.append(button2,'button2')
        tablewidget0 = TableWidget()
        tablewidget0.attr_class = "TableWidget"
        tablewidget0.attr_editor_newclass = False
        tablewidget0.column_count = 3
        tablewidget0.css_display = "table"
        tablewidget0.css_float = "none"
        tablewidget0.css_font_size = "12px"
        tablewidget0.css_height = "100px"
        tablewidget0.css_left = "0px"
        tablewidget0.css_position = "absolute"
        tablewidget0.css_top = "1px"
        tablewidget0.css_width = "1000px"
        tablewidget0.row_count = 2
        tablewidget0.use_title = True
        tablewidget0.variable_name = "tablewidget0"
        container0.append(tablewidget0,'tablewidget0')
        

        self.container0 = container0
        return self.container0
    


#Configuration
configuration = {'config_project_name': 'untitled', 'config_address': '0.0.0.0', 'config_port': 8081, 'config_multiple_instance': True, 'config_enable_file_cache': True, 'config_start_browser': True, 'config_resourcepath': './res/'}

if __name__ == "__main__":
    # start(MyApp,address='127.0.0.1', port=8081, multiple_instance=False,enable_file_cache=True, update_interval=0.1, start_browser=True)
    start(untitled, address=configuration['config_address'], port=configuration['config_port'], 
                        multiple_instance=configuration['config_multiple_instance'], 
                        enable_file_cache=configuration['config_enable_file_cache'],
                        start_browser=configuration['config_start_browser'])
