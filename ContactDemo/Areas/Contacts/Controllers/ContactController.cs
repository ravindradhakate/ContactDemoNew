using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ContactDemo;

namespace ContactDemo.Areas.Contacts.Controllers
{
    public class ContactController : Controller
    {
        private DemoDBEntities db = new DemoDBEntities();
        // GET: Contacts/Contact
        public ActionResult Index()
        {
            return View(db.Contacts.ToList());
        }
    }
}