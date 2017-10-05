using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.SharePoint.Client;
using Microsoft.SharePoint.Client.EventReceivers;

namespace SP365.AddIn.Services
{
    public class AppEventReceiver : IRemoteEventService
    {
        public SPRemoteEventResult ProcessEvent(SPRemoteEventProperties properties)
        {
            if (properties == null) { throw new ArgumentNullException(nameof(properties)); }
            if (string.IsNullOrEmpty(properties.ErrorMessage) == false) { throw new Exception(properties.ErrorMessage); }
            if (string.IsNullOrEmpty(properties.ErrorCode) == false) { throw new Exception(properties.ErrorCode); }
            // 
            SPRemoteEventResult result = new SPRemoteEventResult();
            // 
            using (ClientContext ctx = TokenHelper.CreateAppEventClientContext(properties, useAppWeb: false))
            {
                if (ctx == null) { throw new ArgumentNullException(nameof(ctx)); }
                // 
                const string UCA_NAME = "SP365";
                Guid uniqueInstanceId = new Guid("cdcb95cd-16ee-409e-8a99-f4642c84591a"); //var web = ctx.Web; ctx.Load(web); ctx.ExecuteQuery(); string webServerRelativeUrl = (web.ServerRelativeUrl ?? "/"); Guid webId = web.Id; Guid uniqueInstanceId = webId;
                string uniqueInstanceWebFolderName = uniqueInstanceId.ToString().ToLowerInvariant().Substring(0, 8);
                Version version = properties.AppEventProperties?.Version ?? new Version(1, 0, 0, 0);
                string scriptSrc = $@"https://sp365.pro/add-ins/{uniqueInstanceWebFolderName}/{version}/js/sp365.min.js"; //string scriptSrc = $@"{webServerRelativeUrl.TrimEnd(new char[] { '/' })}/{UCA_WEBRELATIVEFOLDERPATH.Trim(new char[] { '/' })}/app.js?v={version}";
                const int sequence = 10;
                // 
                if (properties.EventType == SPRemoteEventType.AppInstalled || properties.EventType == SPRemoteEventType.AppUpgraded)
                {
                    //addOrUpdateUCAScriptLinkWithInternalScriptSrc(ctx, UCA_NAME, scriptSrc, sequence: sequence);
                    //addOrUpdateUCAScriptLinkWithExternalAsynchScriptSrc(ctx, UCA_NAME, scriptSrc, sequence: sequence);
                    addOrUpdateUCAScriptLinkWithExternalSynchScriptSrc(ctx, UCA_NAME, scriptSrc, sequence: sequence);
                }
                else if (properties.EventType == SPRemoteEventType.AppUninstalling)
                {
                    deleteUCA(ctx, UCA_NAME);
                }
            }
            // 
            return result;
        }
        public void ProcessOneWayEvent(SPRemoteEventProperties properties) { ProcessEvent(properties); }

        private static void addOrUpdateUCAScriptLinkWithInternalScriptSrc(ClientContext ctx, string ucaName, string scriptSrc, int sequence = 10)
        {
            var web = ctx.Web;
            var userCustomActions = web.UserCustomActions; ctx.Load(userCustomActions);
            ctx.ExecuteQuery();
            // 
            var uca = userCustomActions.FirstOrDefault(_ => _.Name == ucaName);
            if (uca == null) { uca = userCustomActions.Add(); uca.Name = ucaName; }
            uca.Location = "ScriptLink";
            uca.ScriptSrc = scriptSrc;
            uca.ScriptBlock = null;
            uca.Sequence = sequence;
            uca.Update();
            // 
            ctx.Load(uca);
            ctx.ExecuteQuery();
        }
        private static void addOrUpdateUCAScriptLinkWithExternalAsynchScriptSrc(ClientContext ctx, string ucaName, string scriptSrc, int sequence = 10)
        {
            var web = ctx.Web;
            var userCustomActions = web.UserCustomActions; ctx.Load(userCustomActions);
            ctx.ExecuteQuery();
            // 
            var uca = userCustomActions.FirstOrDefault(_ => _.Name == ucaName);
            if (uca == null) { uca = userCustomActions.Add(); uca.Name = ucaName; }
            uca.Location = "ScriptLink";
            uca.ScriptSrc = null;
            uca.ScriptBlock = $@"
document.write('<script type=""text/javascript"" src=""{scriptSrc}""></'+'script>');";
            uca.Sequence = sequence;
            uca.Update();
            // 
            ctx.Load(uca);
            ctx.ExecuteQuery();
        }
        private static void addOrUpdateUCAScriptLinkWithExternalSynchScriptSrc(ClientContext ctx, string ucaName, string scriptSrc, int sequence = 10)
        {
            var web = ctx.Web;
            var userCustomActions = web.UserCustomActions; ctx.Load(userCustomActions);
            ctx.ExecuteQuery();
            // 
            var uca = userCustomActions.FirstOrDefault(_ => _.Name == ucaName);
            if (uca == null) { uca = userCustomActions.Add(); uca.Name = ucaName; }
            uca.Location = "ScriptLink";
            uca.ScriptSrc = null;
            uca.ScriptBlock = $@"
(function(){{
try{{
var r=(typeof(XMLHttpRequest)?new XMLHttpRequest():typeof(createXMLHTTPObject)=='function'?createXMLHTTPObject():null);r.open('GET','{scriptSrc}',false);r.send();
var m=(function(s){{eval(s);return (typeof(exports)!='undefined'?exports:undefined);}})(r.responseText);
}}catch(e){{
if(window.console&&window.console.log){{window.console.log('- could not load script synchronously. going to load assynchronously.');}}
document.write('<script type=""text/javascript"" src=""{scriptSrc}""></'+'script>');
}}
}})();
";
            uca.Sequence = sequence;
            uca.Update();
            // 
            ctx.Load(uca);
            ctx.ExecuteQuery();
        }
        private static void deleteUCA(ClientContext ctx, string ucaName)
        {
            var web = ctx.Web;
            var userCustomActions = web.UserCustomActions; ctx.Load(userCustomActions);
            ctx.ExecuteQuery();
            // 
            var uca = userCustomActions.FirstOrDefault(_ => _.Name == ucaName);
            if (uca != null)
            {
                uca.DeleteObject();
                ctx.Load(uca);
                ctx.ExecuteQuery();
            }
        }
    }
}
