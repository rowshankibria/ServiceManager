﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public interface IPhotoService
    {
        byte[] GetImageFile(string fileName);
        byte[] GetDocumentByte(string fileName);
    }
}
