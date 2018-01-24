using Chat.Domain;
using Chat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Chat.Controllers
{
    public class ChatController : Controller
    {

        ChatDBContext dbcontext = new ChatDBContext();
        // GET: Chat
        public ActionResult Chat()
        {
            return View();
        }

        public JsonResult GetHistory(string name="", string dtfrom="", string dtto="")
        {
            IQueryable<Message> messageslist;
            
            messageslist = dbcontext.Messages;
            DateTime dtf;
            DateTime dtt;

            if (DateTime.TryParse(dtfrom, out dtf))
            {
                messageslist = messageslist.Where(x => x.sendTime >= dtf);
            }
            if (DateTime.TryParse(dtto, out dtt))
            {
                messageslist = messageslist.Where(x => x.sendTime <= dtt);
            }

            if (!string.IsNullOrEmpty(name))
            {
                messageslist = messageslist.Where(x => x.UserName == name);
            }

            var messages = messageslist.ToList().Select(s => new
            {
                sendTime = s.sendTime.ToString("dd/MM/yyyy HH:mm:ss"),
                Text = s.Text,
                UserName = s.UserName
            });
            return Json(messages, JsonRequestBehavior.AllowGet);
        }

        protected override void Dispose(bool disposing)
        {
            dbcontext.Dispose();
            base.Dispose(disposing);
        }
    }
}