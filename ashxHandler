<%@ WebHandler Language="C#" Class="ashxHandler" %>

using System;
using System.Web;
using System.IO;
using com.xiechan.Core.CommonIO;
using com.xiechan.Core.Mongo;
using System.Collections.Generic;
using com.xiechan.Core.MsgComm;
using com.xiechan.Core.Redis;
using sdV2._1.Handler;
using sdV2._1;
using sdV2._1.entity;
public class ashxHandler : IHttpHandler {

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "application/json";
        Handler.ip = "mongoip address";
        Handler.db = "mongo db name";

        string action = context.Request.Params["action"];
        string actionType = context.Request.Params["actionType"];

        if (context.Request.HttpMethod == "GET")
        {

            if (action != null)
            {
                if (action == "list")
                {
                    if (actionType != null )
                    {
                        string s = Handler.List(actionType);
                        s = s.Replace("ObjectId(\"", "\"ObjectId(\\\"").Replace("\")", "\\\")\"");
                        string result = "{\"data\":$$1}";
                        context.Response.Write(result.Replace("$$1", s));

                    }

                }
                /*
                if (action == "getSetting")
                {
                    //string s=Handler.GetSetting();
                    string s = "{\"a\":\"bc\"}";
                    context.Response.Write(s.Trim());
                }
                */
            }

        }
        else if (context.Request.HttpMethod == "POST")
        {

            string data = "";
            if (context.Request.Params["data"] != null)
            {
                data = context.Server.UrlDecode(context.Request.Params["data"]);
                if (action == "addItem")
                {
                    Entity doc = null;
                    //1
                    if (actionType == "SalesOrderItem")
                    {
                        doc = Utils.DecodeJson2Object<SalesOrderItem>(data);
                    }
                    //2 3
                    if (actionType == "ShippingRequestItem")
                    {
                        doc = Utils.DecodeJson2Object<ShippingRequestItem>(data);
                    }
                    if (actionType == "CancelShippingRequestItem")
                    {
                        doc = Utils.DecodeJson2Object<CancelShippingRequestItem>(data);
                    }
                    //4
                    if (actionType == "PurchaseOrderItem")
                    {
                        doc = Utils.DecodeJson2Object<PurchaseOrderItem>(data);
                    }
                    //5 6
                    if (actionType == "PurchaseRequestItem")
                    {
                        doc = Utils.DecodeJson2Object<PurchaseRequestItem>(data);
                    }
                    if (actionType == "CancelPurchaseRequestItem")
                    {
                        doc = Utils.DecodeJson2Object<CancelPurchaseRequestItem>(data);
                    }
                    //7 8 9
                    if (actionType == "SdkRequestItem")
                    {
                        doc = Utils.DecodeJson2Object<SdkRequestItem>(data);
                    }
                    if (actionType == "CancelSdkRequestItem")
                    {
                        doc = Utils.DecodeJson2Object<CancelSdkRequestItem>(data);
                    }

                    if (actionType == "SdkReceiveItem")
                    {
                        doc = Utils.DecodeJson2Object<SdkReceiveItem>(data);
                    }
                    //10
                    if (actionType == "InWareHouseRequestItem")
                    {
                        doc = Utils.DecodeJson2Object<InWareHouseRequestItem>(data);
                    }
                    //11 12
                    if (actionType == "ExportOrderItem")
                    {
                        doc = Utils.DecodeJson2Object<ExportOrderItem>(data);
                    }
                    if (actionType == "ImportOrderItem")
                    {
                        doc = Utils.DecodeJson2Object<ImportOrderItem>(data);
                    }
                    //13 14
                    if (actionType == "ProductReplaceItem")
                    {
                        doc = Utils.DecodeJson2Object<ProductReplaceItem>(data);
                    }
                    if (actionType == "ProductLostItem")
                    {
                        doc = Utils.DecodeJson2Object<ProductLostItem>(data);
                    }
                    //15
                    if (actionType == "RedrawPurchaseOrderItem")
                    {
                        doc = Utils.DecodeJson2Object<RedrawPurchaseOrderItem>(data);
                    }
                    
                    Msg msg = Handler.AddOrModifyItem(doc);
                    context.Response.Write(Utils.Encode2Json(msg));

                }
                if (action == "deleteItem")
                {
                    List<string> toBeDelete = Utils.DecodeJson2Object<List<string>>(data);

                    Msg msg = Handler.DeleteItems(toBeDelete, actionType);
                    context.Response.Write(Utils.Encode2Json(msg));
                }
                /*
                if (action == "updateSetting")
                {
                    Msg msg = Handler.UpdateSetting(data);
                    context.Response.Write(Utils.Encode2Json(msg));
                }
                if (action == "setOfficeDepot")
                {
                    OfficeDepot item = Utils.DecodeJson2Object<OfficeDepot>(data);
                    Msg msg = Handler.SetOfficeDepot(item);
                    context.Response.Write(Utils.Encode2Json(msg));
                }
                */

            }

        }
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}
