class PagesController < ApplicationController
  def create
    @page = Page.new(page_params)
    if @page.save
      flash[:success] = "Successfuly page created"
      redirect_to @page
    else
      render 'new'
    end
  end

  def update
    page = Page.find(params[:id])
    if page.update_attributes(page_params)
      redirect_to page
    else
      render 'edit'
    end
  end

  def index
    pages = Page.all
    respond_to do |format|
      format.html
      format.json { render json: pages, only: [:title] }
    end
  end

  def show
    page = Page.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render json: page, only: [:title, :content] }
    end
  end

  private
    def page_params
      params.require(:page).permit(:title, :content)
    end
end
