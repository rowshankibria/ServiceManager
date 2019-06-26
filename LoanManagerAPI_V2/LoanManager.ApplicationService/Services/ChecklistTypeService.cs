using AutoMapper;
using DevExtreme.AspNet.Data;
using DevExtreme.AspNet.Data.ResponseModel;
using LoanManager.ApplicationService.Models;
using LoanManager.Configuration;
using LoanManager.Data;
using LoanManager.Data.Models;
using LoanManager.Shared;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace LoanManager.ApplicationService
{
    public class ChecklistTypeService : BaseService, IChecklistTypeService
    {
        private readonly IRepository<DocumentChecklist> documentChecklistRepository;
        /// <summary>
        /// constructor
        /// </summary>
        /// <param name="contactRepository"></param>
        /// <param name="logger"></param>
        /// <param name="mapper"></param>
        /// <param name="loggedInUserService"></param>
        public ChecklistTypeService(ILogger<ChecklistTypeService> logger,
            IMapper mapper,
            IRepository<DocumentChecklist> documentChecklistRepository,
            ILoggedInUserService loggedInUserService) : base(logger, mapper, loggedInUserService)
        {
            this.documentChecklistRepository = documentChecklistRepository;
        }

        #region Get Methods


        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<IQueryable> GetChecklistTypes()
        {

            var query = from c in this.documentChecklistRepository.GetAll()
                        select new
                        {
                            c.Id,
                            c.Title,
                            c.Description,                           
                        };


            return await Task.Run(() => query.AsQueryable());
        }

        /// <summary>
        /// Get contacts by company
        /// </summary>
        /// <param name="options"></param>
        /// <returns></returns>
        public async Task<LoadResult> GetDevexChecklistTypesAsynch(DataSourceLoadOptionsBase options)
        {
            var query = from c in this.documentChecklistRepository.GetAll()
                        select new
                        {
                            c.Id,
                            c.Title,
                            c.Description,
                        };


            return await Task.Run(() => DataSourceLoader.Load(query, options));
        }


        /// <summary>
        /// Get Entity by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<DocumentChecklistModel> GetEntityAsync(long id)
        {
            if (id == 0)
            {
                return new DocumentChecklistModel();
            }

            DocumentChecklist documentChecklistType = await documentChecklistRepository.Where(x => x.Id == id)                                                       
                                                                                       .FirstOrDefaultAsync();

            if (documentChecklistType == null)
            {
                throw new ItmNotFoundException("Document checklist type not found");
            }

            var documentChecklistObj = Mapper.Map<DocumentChecklistModel>(documentChecklistType);           

            return documentChecklistObj;
        }

        #endregion

        #region Insert/Update/Delete Methods

        /// <summary>
        /// Insert/update entity
        /// </summary>
        /// <param name="contactModel"></param>
        /// <returns></returns>
        public async Task<long> SaveEntityAsync(DocumentChecklistModel checklistModel)
        {
            if (checklistModel == null)
            {
                throw new ItmArgumentMissingException("Document checklist type not found");
            }

            DocumentChecklist checklistType = new DocumentChecklist();

            if (checklistModel.Id > 0)
            {

                checklistType = documentChecklistRepository.Where(b => b.Id == checklistModel.Id).FirstOrDefault();

                if (checklistType == null)
                {
                    throw new ItmNotFoundException("Document checklist type not found");
                }
            }


            if (checklistType != null)
            {
                Mapper.Map(checklistModel, checklistType);              


                if (checklistModel.Id == 0)
                {
                    await documentChecklistRepository.CreateAsync(checklistType);
                }
                else
                {

                    await documentChecklistRepository.UpdateAsync(checklistType);
                }

            }
            return checklistType.Id;
        }


        /// <summary>
        /// Delete entities by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task<bool> DeleteEntityAsync(long id)
        {
            if (id < 1)
            {
                throw new ItmArgumentMissingException("Document checklist type not found");
            }

            if (!await documentChecklistRepository.ExistsAsync(x => x.Id == id))
            {
                throw new ItmArgumentMissingException("Document checklist type not found");
            }

            return await documentChecklistRepository.DeleteAsync(t => t.Id == id) > 0;
        }


        /// <summary>
        /// Delete entities by id list
        /// </summary>
        /// <param name="ids"></param>
        /// <returns></returns>
        public async Task<bool> DeleteEntitiesAsync(List<long> ids)
        {
            if (ids == null)
            {
                throw new ItmArgumentMissingException("Document checklist type not found");
            }
            foreach (long id in ids)
            {
                if (!await documentChecklistRepository.ExistsAsync(x => ids.Contains(x.Id)))
                {
                    throw new ItmArgumentMissingException("Document checklist type not found");
                }

                await documentChecklistRepository.DeleteAsync(t => t.Id == id);
            }
            return true;
        }

        #endregion

        #region Validations Methods



        #endregion

    }
}
