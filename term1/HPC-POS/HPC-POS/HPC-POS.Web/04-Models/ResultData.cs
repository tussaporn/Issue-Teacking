using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HPC_POS.Web.Models
{
    public class ResultData
    {
        public class MessageResult
        {
            public Constants.MESSAGE_TYPE MessageType { get; set; }
            public string Message { get; set; }
            public List<string> Controls { get; set; }

            public MessageResult()
            {
                this.MessageType = Constants.MESSAGE_TYPE.ERROR;
            }
        }

        public object Data { get; set; }
        public List<MessageResult> Messages { get; set; }
        public bool HasError
        {
            get
            {
                if (this.Messages != null)
                    return this.Messages.Select(x =>
                        x.MessageType == Constants.MESSAGE_TYPE.ERROR).Count() > 0;
                return false;
            }
        }

        public ResultData()
        {
            this.Messages = new List<MessageResult>();
        }

        public void AddMessage(string message, params string[] controls)
        {
            AddMessage(Constants.MESSAGE_TYPE.ERROR, message, controls);
        }
        public void AddMessage(Constants.MESSAGE_TYPE type, string message, params string[] controls)
        {
            MessageResult msg = new MessageResult();
            msg.MessageType = type;
            msg.Message = message;

            if (controls != null)
                msg.Controls = controls.ToList();

            this.Messages.Add(msg);
        }
        public void AddMessage(Exception ex, params string[] controls)
        {
            AddMessage(Constants.MESSAGE_TYPE.ERROR, ex, controls);
        }
        public void AddMessage(Constants.MESSAGE_TYPE type, Exception ex, params string[] controls)
        {
            string message = ex.Message;

            if (ex is System.ServiceModel.FaultException)
                message = Resources.Message.BCE000;
            else
            {
                message = Resources.Message.BCE000;
            }

            AddMessage(type, message, controls);
        }
    }
}