using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Chat.Models
{
    public class Message
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string Text { get; set; }
        public DateTime sendTime { get; set; }
    }
}