const Boxes = ({ mainContent, price, percentage, svgIcon }) => {
  return (
    <div className="col-xl-12 col-sm-12 mb-2">
      <div className="card shadow">
        <div className="card-body p-4">
          <div className="row">
            <div className="col-8">
              <div className="numbers">
                <p className="text-sm mb-0 text-capitalize font-weight-bold">{mainContent}</p>
                <h5 className="font-weight-bolder mb-0">
                  {price}
                  <span className="text-success text-sm font-weight-bolder">{percentage}</span>
                </h5>
              </div>
            </div>
            <div className="col-4 d-flex align-items-center justify-content-end">
              <div className="icon icon-shape bg-gradient-primary shadow text-center border-radius-md">
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Boxes;