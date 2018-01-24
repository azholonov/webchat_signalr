﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Chat
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Chat",
                url: "Chat",
                defaults: new { controller = "Chat", action = "Chat", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "GetHistory",
                url: "GetHistory",
                defaults: new { controller = "Chat", action = "GetHistory", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Chat", action = "Chat", id = UrlParameter.Optional }
            );
        }
    }
}
