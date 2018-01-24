using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Chat.Models
{
    public class User
    {
        public int ID { get; set; }
        [Key]
        public string Login { get; set; }
        public string Password { get; set; }
    }
}